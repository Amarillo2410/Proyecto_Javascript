import { read, write, DB_NAME } from './locastor.js';

document.addEventListener('DOMContentLoaded', () => {
  
  // Botones para agregar
  const addAdminBtn = document.getElementById('addAdmin');
  const addProfesorBtn = document.getElementById('addProfesor');
  const addCursoBtn = document.getElementById('addCurso');

  if (addAdminBtn) addAdminBtn.addEventListener('click', agregarAdministrativo);
  if (addProfesorBtn) addProfesorBtn.addEventListener('click', agregarProfesor);
  if (addCursoBtn) addCursoBtn.addEventListener('click', agregarCurso);

  // Cargar tablas al iniciar
  cargarTablaAdministrativos();
  cargarTablaProfesores();
  cargarTablaCursos();

  // ===== ADMINISTRATIVOS =====
  function agregarAdministrativo() {
    const inputs = document.querySelectorAll('.gestion-administrativos input');
    const [idInput, nombreInput, apellidoInput, emailInput, telefonoInput, cargoInput] = inputs;

    const sistema = read(DB_NAME);

    if (!idInput.value || !nombreInput.value || !apellidoInput.value || 
        !emailInput.value || !telefonoInput.value || !cargoInput.value) {
      alert(' Por favor completa todos los campos.');
      return;
    }

    const existe = sistema.administrativos.some(admin => admin.id === idInput.value);
    if (existe) {
      alert(' Ya existe un administrativo con ese ID.');
      return;
    }

    const nuevoAdmin = {
      id: idInput.value,
      nombres: nombreInput.value,
      apellidos: apellidoInput.value,
      email: emailInput.value,
      telefono: telefonoInput.value,
      cargo: cargoInput.value
    };

    sistema.administrativos.push(nuevoAdmin);
    write(DB_NAME, sistema);
    alert(' Administrativo agregado correctamente.');
    inputs.forEach(input => input.value = '');
    cargarTablaAdministrativos();
  }

  function cargarTablaAdministrativos() {
    const sistema = read(DB_NAME);
    let tabla = document.getElementById('tablaAdministrativos');
    
    if (!tabla) {
      tabla = document.createElement('div');
      tabla.id = 'tablaAdministrativos';
      document.querySelector('.gestion-administrativos').appendChild(tabla);
    }

    tabla.innerHTML = `
      <h3>Lista de Administrativos</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Cargo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${sistema.administrativos.map(admin => `
            <tr>
              <td>${admin.id}</td>
              <td>${admin.nombres}</td>
              <td>${admin.apellidos}</td>
              <td>${admin.email}</td>
              <td>${admin.telefono}</td>
              <td>${admin.cargo}</td>
              <td>
                <button onclick="editarAdmin('${admin.id}')"> Editar</button>
                <button onclick="eliminarAdmin('${admin.id}')"> Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  window.editarAdmin = function(id) {
    const sistema = read(DB_NAME);
    const admin = sistema.administrativos.find(a => a.id === id);
    if (!admin) return;

    const inputs = document.querySelectorAll('.gestion-administrativos input');
    const [idInput, nombreInput, apellidoInput, emailInput, telefonoInput, cargoInput] = inputs;

    idInput.value = admin.id;
    nombreInput.value = admin.nombres;
    apellidoInput.value = admin.apellidos;
    emailInput.value = admin.email;
    telefonoInput.value = admin.telefono;
    cargoInput.value = admin.cargo;

    const btnAdd = document.getElementById('addAdmin');
    btnAdd.textContent = ' Guardar Cambios';
    btnAdd.onclick = () => {
      admin.nombres = nombreInput.value;
      admin.apellidos = apellidoInput.value;
      admin.email = emailInput.value;
      admin.telefono = telefonoInput.value;
      admin.cargo = cargoInput.value;

      write(DB_NAME, sistema);
      alert(' Administrativo actualizado');
      inputs.forEach(input => input.value = '');
      btnAdd.textContent = ' Agregar Administrativo';
      btnAdd.onclick = agregarAdministrativo;
      cargarTablaAdministrativos();
    };
  };

  window.eliminarAdmin = function(id) {
    if (!confirm('¿Eliminar este administrativo?')) return;
    
    const sistema = read(DB_NAME);
    sistema.administrativos = sistema.administrativos.filter(a => a.id !== id);
    write(DB_NAME, sistema);
    alert(' Administrativo eliminado');
    cargarTablaAdministrativos();
  };

  // ===== PROFESORES =====
  function agregarProfesor() {
    const nombreInput = document.getElementById('profesorNombre');
    const apellidoInput = document.getElementById('profesorApellido');
    const emailInput = document.getElementById('profesorEmail');
    const telefonoInput = document.getElementById('profesorTelefono');
    const fotoInput = document.getElementById('fotoDocente');
    const areaInput = document.getElementById('profesorArea');

    const sistema = read(DB_NAME);

    if (!nombreInput.value || !apellidoInput.value || !emailInput.value || 
        !telefonoInput.value || !fotoInput.value || !areaInput.value) {
      alert(' Por favor completa todos los campos del profesor.');
      return;
    }

    const nuevoProfesor = {
      codigo: Date.now().toString(),
      identificacion: emailInput.value,
      nombres: nombreInput.value,
      apellidos: apellidoInput.value,
      email: emailInput.value,
      telefono: telefonoInput.value,
      foto: fotoInput.value,
      area: areaInput.value
    };

    sistema.profesores.push(nuevoProfesor);
    write(DB_NAME, sistema);
    alert(' Profesor agregado correctamente.');
    
    nombreInput.value = '';
    apellidoInput.value = '';
    emailInput.value = '';
    telefonoInput.value = '';
    fotoInput.value = '';
    areaInput.value = '';
    
    cargarTablaProfesores();
  }

  function cargarTablaProfesores() {
    const sistema = read(DB_NAME);
    let tabla = document.getElementById('tablaProfesores');
    
    if (!tabla) {
      tabla = document.createElement('div');
      tabla.id = 'tablaProfesores';
      document.querySelector('.gestion-profesores').appendChild(tabla);
    }

    tabla.innerHTML = `
      <h3>Lista de Profesores</h3>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Área</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${sistema.profesores.map(prof => `
            <tr>
              <td>${prof.codigo}</td>
              <td>${prof.nombres}</td>
              <td>${prof.apellidos}</td>
              <td>${prof.email}</td>
              <td>${prof.area}</td>
              <td>
                <button onclick="editarProfesor('${prof.codigo}')"> Editar</button>
                <button onclick="eliminarProfesor('${prof.codigo}')"> Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  window.editarProfesor = function(codigo) {
    const sistema = read(DB_NAME);
    const prof = sistema.profesores.find(p => p.codigo === codigo);
    if (!prof) return;

    document.getElementById('profesorNombre').value = prof.nombres;
    document.getElementById('profesorApellido').value = prof.apellidos;
    document.getElementById('profesorEmail').value = prof.email;
    document.getElementById('profesorTelefono').value = prof.telefono;
    document.getElementById('fotoDocente').value = prof.foto;
    document.getElementById('profesorArea').value = prof.area;

    const btnAdd = document.getElementById('addProfesor');
    btnAdd.textContent = ' Guardar Cambios';
    btnAdd.onclick = () => {
      prof.nombres = document.getElementById('profesorNombre').value;
      prof.apellidos = document.getElementById('profesorApellido').value;
      prof.email = document.getElementById('profesorEmail').value;
      prof.telefono = document.getElementById('profesorTelefono').value;
      prof.foto = document.getElementById('fotoDocente').value;
      prof.area = document.getElementById('profesorArea').value;

      write(DB_NAME, sistema);
      alert(' Profesor actualizado');
      
      document.getElementById('profesorNombre').value = '';
      document.getElementById('profesorApellido').value = '';
      document.getElementById('profesorEmail').value = '';
      document.getElementById('profesorTelefono').value = '';
      document.getElementById('fotoDocente').value = '';
      document.getElementById('profesorArea').value = '';
      
      btnAdd.textContent = ' Agregar Profesor';
      btnAdd.onclick = agregarProfesor;
      cargarTablaProfesores();
    };
  };

  window.eliminarProfesor = function(codigo) {
    const sistema = read(DB_NAME);
    

    const tieneCursos = sistema.cursos.some(curso => curso.docenteCodigo === codigo);
    
    if (tieneCursos) {
      alert(' No se puede eliminar: el profesor tiene cursos asignados.');
      return;
    }

    if (!confirm('¿Eliminar este profesor?')) return;
    
    sistema.profesores = sistema.profesores.filter(p => p.codigo !== codigo);
    write(DB_NAME, sistema);
    alert(' Profesor eliminado');
    cargarTablaProfesores();
  };

  // ===== CURSOS =====
  function agregarCurso() {
    const codigoInput = document.getElementById('cursoCodigo');
    const nombreInput = document.getElementById('cursoNombre');
    const descripcionInput = document.getElementById('cursoDescripcion');
    const docenteInput = document.getElementById('cursoDocente');

    const sistema = read(DB_NAME);

    if (!codigoInput.value || !nombreInput.value || !descripcionInput.value || !docenteInput.value) {
      alert(' Por favor completa todos los campos del curso.');
      return;
    }

    const docenteExiste = sistema.profesores.some(prof => 
      prof.codigo === docenteInput.value || prof.email === docenteInput.value
    );

    if (!docenteExiste) {
      alert(' El docente ingresado no existe.');
      return;
    }

    const nuevoCurso = {
      codigo: codigoInput.value,
      nombre: nombreInput.value,
      descripcion: descripcionInput.value,
      docenteCodigo: docenteInput.value,
      modulos: []
    };

    sistema.cursos.push(nuevoCurso);
    write(DB_NAME, sistema);
    alert(' Curso agregado correctamente.');
    
    codigoInput.value = '';
    nombreInput.value = '';
    descripcionInput.value = '';
    docenteInput.value = '';
    
    cargarTablaCursos();
  }

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
});