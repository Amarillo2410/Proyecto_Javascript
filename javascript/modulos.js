import { read, write, DB_NAME } from './locastor.js';

let cursoActual = null;

window.gestionarModulos = function(codigoCurso) {
  cursoActual = codigoCurso;
  const sistema = read(DB_NAME);
  const curso = sistema.cursos.find(c => c.codigo === codigoCurso);
  
  if (!curso) {
    alert('❌ Curso no encontrado');
    return;
  }

  // Inicializar array de módulos si no existe
  if (!curso.modulos) {
    curso.modulos = [];
    write(DB_NAME, sistema);
  }

  mostrarModalModulos(curso);
};

function mostrarModalModulos(curso) {
  // Crear modal
  const modalHTML = `
    <div id="modalModulos" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    ">
      <div style="
        background: white;
        padding: 30px;
        border-radius: 10px;
        width: 80%;
        max-width: 900px;
        max-height: 90vh;
        overflow-y: auto;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2>Módulos del Curso: ${curso.nombre}</h2>
          <button onclick="cerrarModalModulos()" style="
            background: #e74c3c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
          ">✖ Cerrar</button>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3>Agregar Nuevo Módulo</h3>
          <input id="moduloCodigo" type="text" placeholder="Código del Módulo" style="
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
          ">
          <input id="moduloNombre" type="text" placeholder="Nombre del Módulo" style="
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
          ">
          <textarea id="moduloDescripcion" placeholder="Descripción" style="
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
            min-height: 80px;
          "></textarea>
          <button id="btnAgregarModulo" onclick="agregarModulo()" style="
            background: #27ae60;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
          ">➕ Agregar Módulo</button>
        </div>

        <div id="listaModulos"></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  cargarListaModulos();
}

window.cerrarModalModulos = function() {
  const modal = document.getElementById('modalModulos');
  if (modal) modal.remove();
  cursoActual = null;
};

window.agregarModulo = function() {
  const codigoInput = document.getElementById('moduloCodigo');
  const nombreInput = document.getElementById('moduloNombre');
  const descripcionInput = document.getElementById('moduloDescripcion');

  if (!codigoInput.value || !nombreInput.value || !descripcionInput.value) {
    alert('⚠️ Por favor completa todos los campos');
    return;
  }

  const sistema = read(DB_NAME);
  const curso = sistema.cursos.find(c => c.codigo === cursoActual);

  // Verificar si ya existe el código
  const existe = curso.modulos.some(m => m.codigo === codigoInput.value);
  if (existe) {
    alert('⚠️ Ya existe un módulo con ese código');
    return;
  }

  const nuevoModulo = {
    codigo: codigoInput.value,
    nombre: nombreInput.value,
    descripcion: descripcionInput.value,
    lecciones: []
  };

  curso.modulos.push(nuevoModulo);
  write(DB_NAME, sistema);
  alert('✅ Módulo agregado correctamente');

  codigoInput.value = '';
  nombreInput.value = '';
  descripcionInput.value = '';

  cargarListaModulos();
};

function cargarListaModulos() {
  const sistema = read(DB_NAME);
  const curso = sistema.cursos.find(c => c.codigo === cursoActual);
  const container = document.getElementById('listaModulos');

  if (!curso.modulos || curso.modulos.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999;">No hay módulos creados</p>';
    return;
  }

  container.innerHTML = `
    <h3>Módulos Existentes</h3>
    <div style="display: grid; gap: 15px;">
      ${curso.modulos.map(modulo => `
        <div style="
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        ">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div style="flex: 1;">
              <h4 style="margin: 0 0 10px 0;">${modulo.nombre}</h4>
              <p style="color: #666; margin: 5px 0;"><strong>Código:</strong> ${modulo.codigo}</p>
              <p style="color: #666; margin: 5px 0;">${modulo.descripcion}</p>
              <p style="color: #999; font-size: 0.9em; margin: 5px 0;">
                📚 ${modulo.lecciones ? modulo.lecciones.length : 0} lecciones
              </p>
            </div>
            <div style="display: flex; gap: 10px; flex-direction: column;">
              <button onclick="editarModulo('${modulo.codigo}')" style="
                background: #f39c12;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
              ">✏️ Editar</button>
              <button onclick="eliminarModulo('${modulo.codigo}')" style="
                background: #e74c3c;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
              ">🗑️ Eliminar</button>
              <button onclick="gestionarLecciones('${modulo.codigo}')" style="
                background: #9b59b6;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
              ">📝 Lecciones</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.editarModulo = function(codigoModulo) {
  const sistema = read(DB_NAME);
  const curso = sistema.cursos.find(c => c.codigo === cursoActual);
  const modulo = curso.modulos.find(m => m.codigo === codigoModulo);

  if (!modulo) return;

  document.getElementById('moduloCodigo').value = modulo.codigo;
  document.getElementById('moduloNombre').value = modulo.nombre;
  document.getElementById('moduloDescripcion').value = modulo.descripcion;

  const btnAgregar = document.getElementById('btnAgregarModulo');
  btnAgregar.textContent = '💾 Guardar Cambios';
  btnAgregar.onclick = () => {
    modulo.nombre = document.getElementById('moduloNombre').value;
    modulo.descripcion = document.getElementById('moduloDescripcion').value;

    write(DB_NAME, sistema);
    alert('✅ Módulo actualizado');

    document.getElementById('moduloCodigo').value = '';
    document.getElementById('moduloNombre').value = '';
    document.getElementById('moduloDescripcion').value = '';

    btnAgregar.textContent = 'Agregar Módulo';
    btnAgregar.onclick = agregarModulo;
    cargarListaModulos();
  };
};

window.eliminarModulo = function(codigoModulo) {
  if (!confirm('¿Eliminar este módulo y todas sus lecciones?')) return;

  const sistema = read(DB_NAME);
  const curso = sistema.cursos.find(c => c.codigo === cursoActual);
  curso.modulos = curso.modulos.filter(m => m.codigo !== codigoModulo);

  write(DB_NAME, sistema);
  alert(' Módulo eliminado');
  cargarListaModulos();
};