const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function tieneModulos(carpeta) {
  return fs.existsSync(path.join(root, carpeta, "node_modules"));
}

function instalar(carpeta) {
  if (tieneModulos(carpeta)) return;
  console.log(`Instalando dependencias de ${carpeta}...`);
  const r = spawnSync("npm", ["install"], {
    cwd: path.join(root, carpeta),
    stdio: "inherit",
    shell: true,
  });
  if (r.status) process.exit(r.status);
}

instalar("server");
instalar("client");

const hijos = [];

function arrancar(nombre, args) {
  const hijo = spawn("npm", args, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  hijo.on("exit", (code) => {
    if (code) {
      hijos.forEach((h) => h.kill());
      process.exit(code);
    }
  });
  hijos.push(hijo);
  return hijo;
}

console.log("Servidor: http://127.0.0.1:5000");
console.log("Web:      http://127.0.0.1:5173");

arrancar("server", ["run", "dev:server"]);
arrancar("client", ["run", "dev:client"]);

function parar() {
  hijos.forEach((h) => h.kill());
  process.exit(0);
}

process.on("SIGINT", parar);
process.on("SIGTERM", parar);
