    cargarTablaCursos();

  function cargarTablaCursos() {
    const sistema = read(DB_NAME);
    let tabla = document.getElementById('tablaCursos');
    
    if (!tabla) {
      tabla = document.createElement('div');
      tabla.id = 'tablaCursos';
      document.querySelector('.gestion-cursos').appendChild(tabla);
    }

    tabla.innerHTML = `
      <h3>Lista de Cursos</h3>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Docente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${sistema.cursos.map(curso => {
            const docente = sistema.profesores.find(p => p.codigo === curso.docenteCodigo);
            const nombreDocente = docente ? `${docente.nombres} ${docente.apellidos}` : 'Sin asignar';
            return `
              <tr>
                <td>${curso.codigo}</td>
                <td>${curso.nombre}</td>
                <td>${curso.descripcion}</td>
                <td>${nombreDocente}</td>
                <td>
                  <button onclick="editarCurso('${curso.codigo}')"> Editar</button>
                  <button onclick="eliminarCurso('${curso.codigo}')"> Eliminar</button>
                  <button onclick="gestionarModulos('${curso.codigo}')"> Módulos</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  window.editarCurso = function(codigo) {
    const sistema = read(DB_NAME);
    const curso = sistema.cursos.find(c => c.codigo === codigo);
    if (!curso) return;

    document.getElementById('cursoCodigo').value = curso.codigo;
    document.getElementById('cursoNombre').value = curso.nombre;
    document.getElementById('cursoDescripcion').value = curso.descripcion;
    document.getElementById('cursoDocente').value = curso.docenteCodigo;

    const btnAdd = document.getElementById('addCurso');
    btnAdd.textContent = ' Guardar Cambios';
    btnAdd.onclick = () => {
      curso.nombre = document.getElementById('cursoNombre').value;
      curso.descripcion = document.getElementById('cursoDescripcion').value;
      curso.docenteCodigo = document.getElementById('cursoDocente').value;

      write(DB_NAME, sistema);
      alert(' Curso actualizado');
      
      document.getElementById('cursoCodigo').value = '';
      document.getElementById('cursoNombre').value = '';
      document.getElementById('cursoDescripcion').value = '';
      document.getElementById('cursoDocente').value = '';
      
      btnAdd.textContent = ' Agregar Curso';
      btnAdd.onclick = agregarCurso;
      cargarTablaCursos();
    };
  };

  window.eliminarCurso = function(codigo) {
    if (!confirm('¿Eliminar este curso?')) return;
    
    const sistema = read(DB_NAME);
    sistema.cursos = sistema.cursos.filter(c => c.codigo !== codigo);
    write(DB_NAME, sistema);
    alert(' Curso eliminado');
    cargarTablaCursos();
};