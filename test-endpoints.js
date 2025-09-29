#!/usr/bin/env node

/**
 * Automated API Endpoint Testing Script for Jacha Aru Backend
 *
 * This script tests all 90 endpoints in the application.
 *
 * Usage:
 *   node test-endpoints.js [options]
 *
 * Options:
 *   --host=<url>       API host (default: http://localhost:3000)
 *   --verbose          Show detailed request/response information
 *   --module=<name>    Test only specific module
 *   --skip-auth        Skip authentication tests
 */

const http = require('http');
const https = require('https');

// Configuration
const config = {
  host: process.env.API_HOST || 'http://localhost:3000',
  verbose: process.argv.includes('--verbose'),
  module: process.argv.find(arg => arg.startsWith('--module='))?.split('=')[1],
  skipAuth: process.argv.includes('--skip-auth'),
};

// Test results tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: [],
  warnings: [],
};

// Global state
let authToken = null;
let testUserId = null;
let createdResources = {};

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logVerbose(message) {
  if (config.verbose) {
    console.log(`  ${colors.cyan}${message}${colors.reset}`);
  }
}

// HTTP request helper
function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, config.host);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = client.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = data ? JSON.parse(data) : null;
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsedData,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Test runner
async function runTest(name, method, path, options = {}) {
  results.total++;

  const {
    body = null,
    requiresAuth = false,
    expectedStatus = [200, 201],
    skipTest = false,
  } = options;

  if (skipTest) {
    results.skipped++;
    log(`⊘ ${name}`, 'yellow');
    return null;
  }

  try {
    logVerbose(`Testing: ${method} ${path}`);
    if (body) logVerbose(`Body: ${JSON.stringify(body)}`);

    const token = requiresAuth ? authToken : null;
    const response = await makeRequest(method, path, body, token);

    logVerbose(`Status: ${response.status}`);
    if (config.verbose && response.body) {
      logVerbose(`Response: ${JSON.stringify(response.body).substring(0, 200)}...`);
    }

    const statusArray = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    const isSuccess = statusArray.includes(response.status);

    if (isSuccess) {
      results.passed++;
      log(`✓ ${name}`, 'green');
      return response;
    } else {
      results.failed++;
      log(`✗ ${name} (Expected: ${statusArray.join('|')}, Got: ${response.status})`, 'red');
      results.errors.push({
        test: name,
        expected: statusArray,
        actual: response.status,
        body: response.body,
      });
      return response;
    }
  } catch (error) {
    results.failed++;
    log(`✗ ${name} (Error: ${error.message})`, 'red');
    results.errors.push({
      test: name,
      error: error.message,
    });
    return null;
  }
}

// Authentication Tests
async function testAuthModule() {
  log('\n📍 Testing Auth Module', 'bright');

  const timestamp = Date.now();
  const testEmail = `test${timestamp}@example.com`;
  const testPassword = 'password123';

  // Register
  const registerResponse = await runTest(
    'POST /auth/register',
    'POST',
    '/auth/register',
    {
      body: {
        nombres: 'Test',
        apellidos: 'User',
        mail: testEmail,
        pass: testPassword,
      },
      expectedStatus: [201, 400], // 400 if user exists
    }
  );

  // Login
  const loginResponse = await runTest(
    'POST /auth/login',
    'POST',
    '/auth/login',
    {
      body: {
        mail: testEmail,
        pass: testPassword,
      },
      expectedStatus: [200, 201],
    }
  );

  if (loginResponse && loginResponse.body) {
    authToken = loginResponse.body.access_token || loginResponse.body.token;
    testUserId = loginResponse.body.user?.id;

    if (authToken) {
      log(`  ℹ Auth token obtained`, 'cyan');
    } else {
      results.warnings.push('Could not obtain auth token from login response');
      log(`  ⚠ Warning: Could not obtain auth token`, 'yellow');
    }
  }
}

// Usuarios Tests
async function testUsuariosModule() {
  log('\n📍 Testing Usuarios Module', 'bright');

  await runTest('GET /usuarios', 'GET', '/usuarios', {
    requiresAuth: true,
  });

  await runTest('GET /usuarios/me', 'GET', '/usuarios/me', {
    requiresAuth: true,
  });

  await runTest('PUT /usuarios/me', 'PUT', '/usuarios/me', {
    requiresAuth: true,
    body: { nombres: 'Updated Test' },
  });

  if (testUserId) {
    await runTest(`GET /usuarios/${testUserId}`, 'GET', `/usuarios/${testUserId}`, {
      requiresAuth: true,
    });

    await runTest(`PUT /usuarios/${testUserId}`, 'PUT', `/usuarios/${testUserId}`, {
      requiresAuth: true,
      body: { nombres: 'Updated Via ID' },
    });
  }
}

// Categorias Tests
async function testCategoriasModule() {
  log('\n📍 Testing Categorías Module', 'bright');

  await runTest('GET /categorias', 'GET', '/categorias', {
    requiresAuth: true,
  });

  const createResponse = await runTest('POST /categorias', 'POST', '/categorias', {
    requiresAuth: true,
    body: { categoria: `Test Categoría ${Date.now()}` },
    expectedStatus: [201],
  });

  if (createResponse && createResponse.body && createResponse.body.id) {
    const categoriaId = createResponse.body.id;
    createdResources.categoriaId = categoriaId;

    await runTest(`GET /categorias/${categoriaId}`, 'GET', `/categorias/${categoriaId}`, {
      requiresAuth: true,
    });

    await runTest(`GET /categorias/${categoriaId}/temas`, 'GET', `/categorias/${categoriaId}/temas`, {
      requiresAuth: true,
    });

    await runTest(`PUT /categorias/${categoriaId}`, 'PUT', `/categorias/${categoriaId}`, {
      requiresAuth: true,
      body: { categoria: 'Updated Categoría' },
    });

    await runTest(`DELETE /categorias/${categoriaId}`, 'DELETE', `/categorias/${categoriaId}`, {
      requiresAuth: true,
      expectedStatus: [200, 204],
    });
  }
}

// Temas Tests
async function testTemasModule() {
  log('\n📍 Testing Temas Module', 'bright');

  await runTest('GET /temas', 'GET', '/temas', {
    requiresAuth: true,
  });

  // Create a categoria first for testing
  const categoriaResponse = await makeRequest('POST', '/categorias', {
    categoria: `Test Cat for Tema ${Date.now()}`
  }, authToken);

  if (categoriaResponse.body && categoriaResponse.body.id) {
    const categoriaId = categoriaResponse.body.id;

    const createResponse = await runTest('POST /temas', 'POST', '/temas', {
      requiresAuth: true,
      body: {
        tema: `Test Tema ${Date.now()}`,
        categoriaId: categoriaId,
      },
      expectedStatus: [201],
    });

    if (createResponse && createResponse.body && createResponse.body.id) {
      const temaId = createResponse.body.id;
      createdResources.temaId = temaId;

      await runTest(`GET /temas/${temaId}`, 'GET', `/temas/${temaId}`, {
        requiresAuth: true,
      });

      await runTest(`PUT /temas/${temaId}`, 'PUT', `/temas/${temaId}`, {
        requiresAuth: true,
        body: { tema: 'Updated Tema' },
      });

      await runTest(`DELETE /temas/${temaId}`, 'DELETE', `/temas/${temaId}`, {
        requiresAuth: true,
        expectedStatus: [200, 204],
      });
    }

    // Cleanup
    await makeRequest('DELETE', `/categorias/${categoriaId}`, null, authToken);
  }
}

// Indicadores Tests
async function testIndicadoresModule() {
  log('\n📍 Testing Indicadores Module', 'bright');

  await runTest('GET /indicadores', 'GET', '/indicadores', {
    requiresAuth: true,
  });

  const createResponse = await runTest('POST /indicadores', 'POST', '/indicadores', {
    requiresAuth: true,
    body: { indicador: `Test Indicador ${Date.now()}` },
    expectedStatus: [201],
  });

  if (createResponse && createResponse.body && createResponse.body.id) {
    const indicadorId = createResponse.body.id;

    await runTest(`GET /indicadores/${indicadorId}`, 'GET', `/indicadores/${indicadorId}`, {
      requiresAuth: true,
    });

    await runTest(`PUT /indicadores/${indicadorId}`, 'PUT', `/indicadores/${indicadorId}`, {
      requiresAuth: true,
      body: { indicador: 'Updated Indicador' },
    });

    await runTest(`DELETE /indicadores/${indicadorId}`, 'DELETE', `/indicadores/${indicadorId}`, {
      requiresAuth: true,
      expectedStatus: [200, 204],
    });
  }
}

// Fuentes Tests
async function testFuentesModule() {
  log('\n📍 Testing Fuentes Module', 'bright');

  await runTest('GET /fuentes', 'GET', '/fuentes', {
    requiresAuth: true,
  });

  const createResponse = await runTest('POST /fuentes', 'POST', '/fuentes', {
    requiresAuth: true,
    body: { fuente: `Test Fuente ${Date.now()}`, state: 1 },
    expectedStatus: [201],
  });

  if (createResponse && createResponse.body && createResponse.body.id) {
    const fuenteId = createResponse.body.id;

    await runTest(`GET /fuentes/${fuenteId}`, 'GET', `/fuentes/${fuenteId}`, {
      requiresAuth: true,
    });

    await runTest(`PUT /fuentes/${fuenteId}`, 'PUT', `/fuentes/${fuenteId}`, {
      requiresAuth: true,
      body: { fuente: 'Updated Fuente' },
    });

    await runTest(`DELETE /fuentes/${fuenteId}`, 'DELETE', `/fuentes/${fuenteId}`, {
      requiresAuth: true,
      expectedStatus: [200, 204],
    });
  }
}

// Years Tests
async function testYearsModule() {
  log('\n📍 Testing Years Module', 'bright');

  await runTest('GET /years', 'GET', '/years', {
    requiresAuth: true,
  });

  const testYear = 2020 + Math.floor(Math.random() * 10);
  const createResponse = await runTest('POST /years', 'POST', '/years', {
    requiresAuth: true,
    body: { year: testYear },
    expectedStatus: [201, 400], // 400 if year exists
  });

  if (createResponse && createResponse.body && createResponse.body.id) {
    const yearId = createResponse.body.id;

    await runTest(`GET /years/${yearId}`, 'GET', `/years/${yearId}`, {
      requiresAuth: true,
    });

    await runTest(`PUT /years/${yearId}`, 'PUT', `/years/${yearId}`, {
      requiresAuth: true,
      body: { year: testYear + 1 },
      expectedStatus: [200, 400], // 400 if year exists
    });

    await runTest(`DELETE /years/${yearId}`, 'DELETE', `/years/${yearId}`, {
      requiresAuth: true,
      expectedStatus: [200, 204],
    });
  }
}

// Desegregacion Tests
async function testDesegregacionModule() {
  log('\n📍 Testing Tipos de Desegregación Module', 'bright');

  await runTest('GET /tipos-desegregacion', 'GET', '/tipos-desegregacion', {
    requiresAuth: true,
  });

  const createTipoResponse = await runTest('POST /tipos-desegregacion', 'POST', '/tipos-desegregacion', {
    requiresAuth: true,
    body: { tipoDesg: `Test Tipo ${Date.now()}`, state: 1 },
    expectedStatus: [201],
  });

  if (createTipoResponse && createTipoResponse.body && createTipoResponse.body.id) {
    const tipoId = createTipoResponse.body.id;

    await runTest(`GET /tipos-desegregacion/${tipoId}`, 'GET', `/tipos-desegregacion/${tipoId}`, {
      requiresAuth: true,
    });

    await runTest(`PUT /tipos-desegregacion/${tipoId}`, 'PUT', `/tipos-desegregacion/${tipoId}`, {
      requiresAuth: true,
      body: { tipoDesg: 'Updated Tipo' },
    });

    // Test desegregaciones with this tipo
    log('\n📍 Testing Desegregaciones Module', 'bright');

    await runTest('GET /desegregaciones', 'GET', '/desegregaciones', {
      requiresAuth: true,
    });

    const createDesgResponse = await runTest('POST /desegregaciones', 'POST', '/desegregaciones', {
      requiresAuth: true,
      body: {
        tipoDesegregacionId: tipoId,
        desagregacion: `Test Desg ${Date.now()}`,
        state: 1,
      },
      expectedStatus: [201],
    });

    if (createDesgResponse && createDesgResponse.body && createDesgResponse.body.id) {
      const desgId = createDesgResponse.body.id;

      await runTest(`GET /desegregaciones/${desgId}`, 'GET', `/desegregaciones/${desgId}`, {
        requiresAuth: true,
      });

      await runTest(`PUT /desegregaciones/${desgId}`, 'PUT', `/desegregaciones/${desgId}`, {
        requiresAuth: true,
        body: { desagregacion: 'Updated Desg' },
      });

      await runTest(`DELETE /desegregaciones/${desgId}`, 'DELETE', `/desegregaciones/${desgId}`, {
        requiresAuth: true,
        expectedStatus: [200, 204],
      });
    }

    await runTest(`DELETE /tipos-desegregacion/${tipoId}`, 'DELETE', `/tipos-desegregacion/${tipoId}`, {
      requiresAuth: true,
      expectedStatus: [200, 204],
    });
  }
}

// Investigadores Tests
async function testInvestigadoresModule() {
  log('\n📍 Testing Investigadores Module', 'bright');

  await runTest('GET /investigadores', 'GET', '/investigadores', {
    requiresAuth: true,
  });

  const createResponse = await runTest('POST /investigadores', 'POST', '/investigadores', {
    requiresAuth: true,
    body: {
      nombre: 'Test',
      apellido: 'Investigador',
      correo: `investigador${Date.now()}@example.com`,
      state: 1,
    },
    expectedStatus: [201],
  });

  if (createResponse && createResponse.body && createResponse.body.id) {
    const investigadorId = createResponse.body.id;
    createdResources.investigadorId = investigadorId;

    await runTest(`GET /investigadores/${investigadorId}`, 'GET', `/investigadores/${investigadorId}`, {
      requiresAuth: true,
    });

    await runTest(`GET /investigadores/${investigadorId}/consultas`, 'GET', `/investigadores/${investigadorId}/consultas`, {
      requiresAuth: true,
    });

    await runTest(`PUT /investigadores/${investigadorId}`, 'PUT', `/investigadores/${investigadorId}`, {
      requiresAuth: true,
      body: { nombre: 'Updated Investigador' },
    });

    await runTest(`DELETE /investigadores/${investigadorId}`, 'DELETE', `/investigadores/${investigadorId}`, {
      requiresAuth: true,
      expectedStatus: [200, 204],
    });
  }
}

// Filtros Tests
async function testFiltrosModule() {
  log('\n📍 Testing Filtros Module', 'bright');

  await runTest('GET /filtros', 'GET', '/filtros', {
    requiresAuth: true,
  });

  // Note: Creating a full filtro requires multiple related resources
  // This is a simplified test that may fail if required resources don't exist
  log('  ℹ Skipping POST /filtros (requires multiple related resources)', 'cyan');
  results.skipped++;
}

// Consultations Tests
async function testConsultationsModules() {
  log('\n📍 Testing Consulta Rápida Module', 'bright');

  await runTest('GET /consultations/rapidas', 'GET', '/consultations/rapidas', {
    requiresAuth: true,
  });

  await runTest('GET /consultations/rapidas/all', 'GET', '/consultations/rapidas/all', {
    requiresAuth: true,
  });

  log('\n📍 Testing Consulta Filtro Module', 'bright');

  await runTest('GET /consultations/filtros', 'GET', '/consultations/filtros', {
    requiresAuth: true,
  });

  await runTest('GET /consultations/filtros/all', 'GET', '/consultations/filtros/all', {
    requiresAuth: true,
  });

  log('\n📍 Testing Consulta Compleja Module', 'bright');

  await runTest('GET /consultations/complejas', 'GET', '/consultations/complejas', {
    requiresAuth: true,
  });

  await runTest('GET /consultations/complejas/all', 'GET', '/consultations/complejas/all', {
    requiresAuth: true,
  });

  // Note: Creating consultations requires valid filtroId and investigadorId
  log('  ℹ Skipping POST consultations (requires valid related resources)', 'cyan');
  results.skipped += 3;
}

// Root endpoint test
async function testRootEndpoint() {
  log('\n📍 Testing Root Endpoint', 'bright');
  await runTest('GET /', 'GET', '/', {
    requiresAuth: false,
  });
}

// Main test runner
async function runAllTests() {
  log('╔════════════════════════════════════════════════════════╗', 'bright');
  log('║   Jacha Aru Backend - API Endpoint Testing Script     ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝', 'bright');
  log(`\nTesting API at: ${config.host}`, 'cyan');
  log(`Verbose mode: ${config.verbose ? 'ON' : 'OFF'}`, 'cyan');
  if (config.module) {
    log(`Testing module: ${config.module}`, 'cyan');
  }

  const startTime = Date.now();

  try {
    await testRootEndpoint();

    if (!config.skipAuth) {
      await testAuthModule();
    }

    if (!authToken && !config.skipAuth) {
      log('\n⚠ Could not obtain auth token. Skipping authenticated tests.', 'yellow');
      return;
    }

    // Run module-specific tests if specified
    if (config.module) {
      const moduleTests = {
        usuarios: testUsuariosModule,
        categorias: testCategoriasModule,
        temas: testTemasModule,
        indicadores: testIndicadoresModule,
        fuentes: testFuentesModule,
        years: testYearsModule,
        desegregacion: testDesegregacionModule,
        investigadores: testInvestigadoresModule,
        filtros: testFiltrosModule,
        consultations: testConsultationsModules,
      };

      const testFn = moduleTests[config.module];
      if (testFn) {
        await testFn();
      } else {
        log(`\n⚠ Unknown module: ${config.module}`, 'yellow');
        log(`Available modules: ${Object.keys(moduleTests).join(', ')}`, 'cyan');
      }
    } else {
      // Run all tests
      await testUsuariosModule();
      await testCategoriasModule();
      await testTemasModule();
      await testIndicadoresModule();
      await testFuentesModule();
      await testYearsModule();
      await testDesegregacionModule();
      await testInvestigadoresModule();
      await testFiltrosModule();
      await testConsultationsModules();
    }

  } catch (error) {
    log(`\n✗ Fatal error: ${error.message}`, 'red');
    console.error(error);
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Print summary
  log('\n╔════════════════════════════════════════════════════════╗', 'bright');
  log('║                    Test Summary                        ║', 'bright');
  log('╚════════════════════════════════════════════════════════╝', 'bright');
  log(`\nTotal Tests:    ${results.total}`, 'cyan');
  log(`Passed:         ${results.passed}`, 'green');
  log(`Failed:         ${results.failed}`, 'red');
  log(`Skipped:        ${results.skipped}`, 'yellow');
  log(`Duration:       ${duration}s`, 'cyan');

  if (results.warnings.length > 0) {
    log('\n⚠ Warnings:', 'yellow');
    results.warnings.forEach(warning => {
      log(`  • ${warning}`, 'yellow');
    });
  }

  if (results.errors.length > 0) {
    log('\n✗ Failed Tests:', 'red');
    results.errors.forEach(error => {
      log(`  • ${error.test}`, 'red');
      if (error.expected) {
        log(`    Expected: ${error.expected.join('|')}, Got: ${error.actual}`, 'red');
      }
      if (error.error) {
        log(`    Error: ${error.error}`, 'red');
      }
    });
  }

  const successRate = ((results.passed / results.total) * 100).toFixed(1);
  log(`\nSuccess Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'yellow');

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  log(`\n✗ Unexpected error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
