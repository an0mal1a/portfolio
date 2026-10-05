# Portfolio backend

Este repositorio sostiene el portfolio público y el pequeño sistema que lo
alimenta. La web no habla directamente con GitHub ni con el worker: el navegador
solo consume la API Rust. El resto queda detrás, con responsabilidades separadas.

## Piezas del sistema

| Servicio | Responsabilidad |
| --- | --- |
| Nuxt | Renderiza el portfolio y el panel técnico de `/system`. |
| Rust / Axum | Expone los datos públicos, recibe el formulario de contacto y agrega el estado operativo. |
| Python / FastAPI | Ejecuta tareas internas, entre ellas la sincronización de GitHub. |
| PostgreSQL | Guarda proyectos, repositorios, relaciones y el historial de sincronizaciones. |

La API Rust es la única capa que se expone al frontend. Python no forma parte de
la ruta de navegación de un visitante.

## Estado del sistema

`GET /system/status` es una fotografía breve del estado del servicio. Ejecuta
las comprobaciones en paralelo con Tokio para que una dependencia lenta no
retrase innecesariamente al resto:

- Consulta los pools reader y writer de PostgreSQL con `SELECT 1`.
- Pide el health check del worker Python.
- Lee el último job de GitHub y los contadores de repositorios/lenguajes desde
  PostgreSQL. Esta consulta usa `writer_db`, que es el rol con el que se
  mantienen los datos de sincronización.
- Comprueba SMTP solo si está configurado.

La respuesta no contiene métricas de visitantes ni perfiles de usuario. Son
señales de la propia infraestructura: disponibilidad, latencia, uptime y estado
del último proceso interno.

## Contrato Rust → Python

Rust realiza una sola request ligera al worker:

```http
GET /health
Accept: application/json
```

Python debe responder rápido, sin iniciar una sincronización ni consultar
recursos externos. El contrato mínimo es un HTTP `2xx` con este cuerpo:

```json
{
  "status": "ok"
}
```

También se acepta `"healthy"`. Se pueden añadir campos como `service`,
`version` o `scheduler`; Rust los ignora para no acoplar ambos servicios.

El requester HTTP está en `backends/rust-api/src/services/web_requester.rs`.
Lee `Content-Length` en vez de esperar al cierre del socket, respeta un timeout
global y prueba las direcciones IPv6 e IPv4 que resuelva un host. Esto es
importante en local, donde Uvicorn suele escuchar solo en `127.0.0.1`.

## Sincronización de GitHub

El worker de Python es quien habla con GitHub. Recoge repositorios, propietarios,
colaboradores, temas y lenguajes; después actualiza las tablas del esquema
`github`. La API Rust no dispara ese trabajo: únicamente expone su último estado
cuando está disponible en `github.sync_jobs`.

Un `github.status` igual a `unavailable` significa que la consulta del historial
no se ha podido completar. No implica necesariamente que GitHub esté caído. Un
estado `unknown` o `degraded` con cero jobs suele indicar que todavía no existe
una ejecución registrada.

Las ejecuciones iniciadas por un visitante desde `/github` son independientes:
Python las registra en `github.job_runs`; las ejecuciones diarias internas
siguen en `github.sync_jobs`. En una base de datos ya creada hay que aplicar
una vez `backends/postgres/migrations/001_public_job_runs.sql` antes de desplegar
la API pública.

## Sincronización pública en tiempo real

El portfolio permite a los visitantes sincronizar manualmente el perfil y los
repositorios desde `/github`. Las ejecuciones son independientes de los jobs
interiores y quedan registradas en `github.job_runs`.

El progreso de la sincronización se transmite en tiempo real mediante SSE,
sin esperas silenciosas. El frontend recibe actualizaciones de cada fase:
validación de acceso, consulta del perfil, carga de repositorios, topics,
contributors, lenguajes, persistencia en PostgreSQL y finalización.

El modal de sincronización mantiene la coherencia visual del portfolio. El flujo
es intuitivo: el usuario elige la tarea (perfil, repositorios o ambos), ve el
progreso en vivo y puede regresar a la elección inicial al cerrar sin perder
el estado del job activo en el servidor.

## Configuración local

Copia los valores necesarios a `backends/.env`. Para ejecutar el worker fuera de
Docker con Uvicorn en el puerto 8080:

```env
PYTHON_API_URL=http://127.0.0.1:8080
```

En Docker, el `Dockerfile` del worker usa el puerto 8001 dentro de su red:

```env
PYTHON_API_URL=http://python-api:8001
```

Las credenciales de PostgreSQL, SMTP y GitHub viven solo en el `.env` local; no
deben añadirse al repositorio.

## Arranque

Con contenedores:

```bash
docker compose up --build
```

En local, cada proceso puede arrancarse por separado:

```bash
# API Rust
cd backends/rust-api
cargo run

# Worker Python
cd backends/python-api
uvicorn app:app --port 8080

# Frontend
cd frontend
npm run dev
```

El estado agregado se puede comprobar con:

```bash
curl http://127.0.0.1:8000/system/status
```

## Health checks y despliegue

La API Rust expone dos probes distintos:

- `GET /health`: *liveness*. Solo confirma que el proceso HTTP está vivo.
- `GET /health/ready`: *readiness*. Devuelve `200` únicamente cuando los pools
  reader y writer de PostgreSQL responden; devuelve `503` al comenzar el
  apagado ordenado o si la base de datos no está disponible.

El `Dockerfile` comprueba `/health/ready` automáticamente. En Coolify, si has
configurado un health check HTTP manual, usa la ruta `/health/ready` y el puerto
`8000`. La aplicación atiende `SIGTERM` (Coolify/Docker) y `SIGINT`: primero se
marca como no preparada para recibir tráfico y después Axum deja terminar las
peticiones que ya están en curso.

## Verificación

```bash
cd backends/rust-api
cargo fmt -- --check
cargo test --offline web_requester::tests
cargo check --offline

cd ../../frontend
npm run build
```

## Carga de datos del portfolio

`01-init.sh` crea el esquema e importa los archivos `/opt/postgres/data/*.sql`
solo durante la primera inicialización de PostgreSQL, cuando el volumen de datos
está vacío. Reiniciar o reconstruir el contenedor con una base de datos existente
no vuelve a ejecutar esta carga.

El `docker-compose.yml` monta `/data/portfolio/postgres-hardcoded` del host en
`/opt/postgres/data`. Por tanto, para la carga inicial los SQL deben estar en esa
carpeta del host. Los archivos de `backends/postgres/hardcoded_data` no se copian
actualmente a la imagen: la instrucción `COPY` está comentada en el Dockerfile.

Para importar manualmente el SQL local en una base de datos ya inicializada,
ejecuta desde la raíz del repositorio:

```bash
docker compose exec -T db sh -c '
  exec psql --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" \
    --set=ON_ERROR_STOP=1 --single-transaction --file=-
' < backends/postgres/hardcoded_data/portfolio.sql
```

Para importar el archivo que ya está montado dentro del contenedor:

```bash
docker compose exec -T db sh -c '
  exec psql --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" \
    --set=ON_ERROR_STOP=1 --single-transaction \
    --file=/opt/postgres/data/portfolio.sql
'
```

Ambos comandos usan las credenciales del contenedor y una transacción: si una
sentencia falla, se revierte la importación completa. No requieren recrear la
base de datos ni ejecutar otra vez `01-init.sh`.

El SQL decide qué se actualiza al repetir la carga. Los clientes usan
`WHERE NOT EXISTS`; los proyectos usan `ON CONFLICT (slug) DO UPDATE`, pero
varios de esos bloques solo actualizan `content_html` y `updated_at`. Cambiar
otros campos en el `INSERT` no actualiza por sí solo un proyecto existente:
añádelos al `DO UPDATE` correspondiente si también deben cambiar.

Los proyectos deben referenciar `github_repository_github_id`: un trigger
resuelve el id interno de PostgreSQL cuando el repositorio ya está sincronizado.



