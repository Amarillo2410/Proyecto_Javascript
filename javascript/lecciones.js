import { read, write, DB_NAME } from './locastor.js';

let moduloActual = null;

window.gestionarLecciones = function(codigoModulo) {
  moduloActual = codigoModulo;
  const sistema = read(DB_NAME);
  const curso = sistema.cursos.find(c => c.codigo === window.cursoActual || cursoActual);
  const modulo = curso.modulos.find(m => m.codigo === codigoModulo);
  
  if (!modulo) {
    alert(' Módulo no encontrado');
    return;
  }

  if (!modulo.lecciones) {
    modulo.lecciones = [];
    write(DB_NAME, sistema);
  }

  mostrarModalLecciones(modulo);
};

function mostrarModalLecciones(modulo) {
  const modalHTML = `
    <div id="modalLecciones" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    ">
      <div style="
        background: white;
        padding: 30px;
        border-radius: 10px;
        width: 85%;
        max-width: 1000px;
        max-height: 90vh;
        overflow-y: auto;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2>Lecciones del Módulo: ${modulo.nombre}</h2>
          <button onclick="cerrarModalLecciones()" style="
            background: #e74c3c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
          ">✖ Cerrar</button>
        </div>

        <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3>Agregar Nueva Lección</h3>
          <input id="leccionTitulo" type="text" placeholder="Título de la Lección" style="
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
          ">
          <input id="leccionIntensidad" type="number" placeholder="Intensidad Horaria (horas)" style="
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
          ">
          <textarea id="leccionContenido" placeholder="Contenido (Material de estudio)" style="
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
            min-height: 100px;
          "></textarea>
          
          <div style="margin-top: 15px;">
            <h4>Recursos Multimedia (Opcional)</h4>
            <input id="recursoVideo" type="url" placeholder="URL Video (YouTube, Vimeo, etc.)" style="
              width: 100%;
              padding: 10px;
              margin: 5px 0;
              border: 1px solid #ddd;
              border-radius: 5px;
            ">
            <input id="recursoPDF" type="url" placeholder="URL PDF" style="
              width: 100%;
              padding: 10px;
              margin: 5px 0;
              border: 1px solid #ddd;
              border-radius: 5px;
            ">
            <input id="recursoImagen" type="url" placeholder="URL Imagen" style="
              width: 100%;
              padding: 10px;
              margin: 5px 0;
              border: 1px solid #ddd;
              border-radius: 5px;
            ">
            <input id="recursoEnlace" type="url" placeholder="Enlace Adicional" style="
              width: 100%;
              padding: 10px;
              margin: 5px 0;
              border: 1px solid #ddd;
              border-radius: 5px;
            ">
          </div>

          <button id="btnAgregarLeccion" onclick="agregarLeccion()" style="
            background: #27ae60;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 15px;
          "> Agregar Lección</button>
        </div>

        <div id="listaLecciones"></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  cargarListaLecciones();
}

window.cerrarModalLecciones = function() {
  const modal = document.getElementById('modalLecciones');
  if (modal) modal.remove();
  moduloActual = null;
};

window.agregarLeccion = function() {
  const tituloInput = document.getElementById('leccionTitulo');
  const intensidadInput = document.getElementById('leccionIntensidad');
  const contenidoInput = document.getElementById('leccionContenido');
  const videoInput = document.getElementById('recursoVideo');
  const pdfInput = document.getElementById('recursoPDF');
  const imagenInput = document.getElementById('recursoImagen');
  const enlaceInput = document.getElementById('recursoEnlace');

  if (!tituloInput.value || !intensidadInput.value || !contenidoInput.value) {
    alert(' Por favor completa los campos obligatorios (título, intensidad y contenido)');
    return;
  }

  const sistema = read(DB_NAME);
  const curso = sistema.cursos.find(c => c.modulos.some(m => m.codigo === moduloActual));
  const modulo = curso.modulos.find(m => m.codigo === moduloActual);

  const multimedia = [];
  if (videoInput.value) multimedia.push({ tipo: 'video', url: videoInput.value });
  if (pdfInput.value) multimedia.push({ tipo: 'pdf', url: pdfInput.value });
  if (imagenInput.value) multimedia.push({ tipo: 'imagen', url: imagenInput.value });
  if (enlaceInput.value) multimedia.push({ tipo: 'enlace', url: enlaceInput.value });

  const nuevaLeccion = {
    id: Date.now().toString(),
    titulo: tituloInput.value,
    intensidadHoraria: parseInt(intensidadInput.value),
    contenido: contenidoInput.value,
    multimedia: multimedia
  };

  modulo.lecciones.push(nuevaLeccion);
  write(DB_NAME, sistema);
  alert('✅ Lección agregada correctamente');

  tituloInput.value = '';
  intensidadInput.value = '';
  contenidoInput.value = '';
  videoInput.value = '';
  pdfInput.value = '';
  imagenInput.value = '';
  enlaceInput.value = '';

  cargarListaLecciones();
};

function cargarListaLecciones() {
  const sistema = read(DB_NAME);
  const curso = sistema.cursos.find(c => c.modulos.some(m => m.codigo === moduloActual));
  const modulo = curso.modulos.find(m => m.codigo === moduloActual);
  const container = document.getElementById('listaLecciones');

  if (!modulo.lecciones || modulo.lecciones.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999;">No hay lecciones creadas</p>';
    return;
  }

  container.innerHTML = `
    <h3>Lecciones Existentes</h3>
    <div style="display: grid; gap: 15px;">
      ${modulo.lecciones.map(leccion => `
        <div style="
          background: #fff9e6;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #f39c12;
        ">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div style="flex: 1;">
              <h4 style="margin: 0 0 10px 0;">${leccion.titulo}</h4>
              <p style="color: #666; margin: 5px 0;">
                <strong>⏱️ Intensidad:</strong> ${leccion.intensidadHoraria} hora(s)
              </p>
              <p style="color: #555; margin: 10px 0; line-height: 1.5;">
                ${leccion.contenido}
              </p>
              ${leccion.multimedia && leccion.multimedia.length > 0 ? `
                <div style="margin-top: 15px;">
                  <strong>📎 Recursos Multimedia:</strong>
                  <ul style="margin: 5px 0; padding-left: 20px;">
                    ${leccion.multimedia.map(recurso => `
                      <li>
                        <a href="${recurso.url}" target="_blank" style="color: #3498db;">
                          ${recurso.tipo === 'video' ? '🎥' : 
                            recurso.tipo === 'pdf' ? '📄' : 
                            recurso.tipo === 'imagen' ? '🖼️' : '🔗'} 
                          ${recurso.tipo.toUpperCase()}
                        </a>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
            <div style="display: flex; gap: 10px; flex-direction: column;">
              <button onclick="editarLeccion('${leccion.id}')" style="
                background: #f39c12;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
              ">✏️ Editar</button>
              <button onclick="eliminarLeccion('${leccion.id}')" style="
                background: #e74c3c;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
              ">🗑️ Eliminar</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.editarLeccion = function(idLeccion) {
  const sistema = read(DB_NAME);
  const curso = sistema.cursos.find(c => c.modulos.some(m => m.codigo === moduloActual));
  const modulo = curso.modulos.find(m => m.codigo === moduloActual);
  const leccion = modulo.lecciones.find(l => l.id === idLeccion);

  if (!leccion) return;

  document.getElementById('leccionTitulo').value = leccion.titulo;
  document.getElementById('leccionIntensidad').value = leccion.intensidadHoraria;
  document.getElementById('leccionContenido').value = leccion.contenido;

  const videoRecurso = leccion.multimedia.find(m => m.tipo === 'video');
  const pdfRecurso = leccion.multimedia.find(m => m.tipo === 'pdf');
  const imagenRecurso = leccion.multimedia.find(m => m.tipo === 'imagen');
  const enlaceRecurso = leccion.multimedia.find(m => m.tipo === 'enlace');

  if (videoRecurso) document.getElementById('recursoVideo').value = videoRecurso.url;
  if (pdfRecurso) document.getElementById('recursoPDF').value = pdfRecurso.url;
  if (imagenRecurso) document.getElementById('recursoImagen').value = imagenRecurso.url;
  if (enlaceRecurso) document.getElementById('recursoEnlace').value = enlaceRecurso.url;

  const btnAgregar = document.getElementById('btnAgregarLeccion');
  btnAgregar.textContent = '💾 Guardar Cambios';
  btnAgregar.onclick = () => {
    leccion.titulo = document.getElementById('leccionTitulo').value;
    leccion.intensidadHoraria = parseInt(document.getElementById('leccionIntensidad').value);
    leccion.contenido = document.getElementById('leccionContenido').value;

    const multimedia = [];
    const video = document.getElementById('recursoVideo').value;
    const pdf = document.getElementById('recursoPDF').value;
    const imagen = document.getElementById('recursoImagen').value;
    const enlace = document.getElementById('recursoEnlace').value;

    if (video) multimedia.push({ tipo: 'video', url: video });
    if (pdf) multimedia.push({ tipo: 'pdf', url: pdf });
    if (imagen) multimedia.push({ tipo: 'imagen', url: imagen });
    if (enlace) multimedia.push({ tipo: 'enlace', url: enlace });

    leccion.multimedia = multimedia;

    write(DB_NAME, sistema);
    alert('✅ Lección actualizada');

    document.getElementById('leccionTitulo').value = '';
    document.getElementById('leccionIntensidad').value = '';
    document.getElementById('leccionContenido').value = '';
    document.getElementById('recursoVideo').value = '';
    document.getElementById('recursoPDF').value = '';
    document.getElementById('recursoImagen').value = '';
    document.getElementById('recursoEnlace').value = '';

    btnAgregar.textContent = ' Agregar Lección';
    btnAgregar.onclick = agregarLeccion;
    cargarListaLecciones();
  };
};

window.eliminarLeccion = function(idLeccion) {
  if (!confirm('¿Eliminar esta lección?')) return;

  const sistema = read(DB_NAME);
  const curso = sistema.cursos.find(c => c.modulos.some(m => m.codigo === moduloActual));
  const modulo = curso.modulos.find(m => m.codigo === moduloActual);
  modulo.lecciones = modulo.lecciones.filter(l => l.id !== idLeccion);

  write(DB_NAME, sistema);
  alert(' Lección eliminada');
  cargarListaLecciones();
};