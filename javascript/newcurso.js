import { read, DB_NAME } from './locastor.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Módulo de visualización de cursos cargado');
    cargarCursos();
});

function cargarCursos() {
    const sistema = read(DB_NAME);
    const container = document.getElementById('contenedorCursos');
    
    if (!container) {
        console.error('❌ No se encontró el contenedor de cursos');
        return;
    }

    if (!sistema || !sistema.cursos || sistema.cursos.length === 0) {
        container.innerHTML = `
            <div class="mensaje-vacio" style="grid-column: 1/-1;">
                <h2>📚 No hay cursos disponibles</h2>
                <p>Los cursos se agregarán desde el panel administrativo</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    sistema.cursos.forEach(curso => {
        const docente = sistema.profesores.find(p => p.codigo === curso.docenteCodigo);
        const nombreDocente = docente ? `${docente.nombres} ${docente.apellidos}` : 'Sin docente';
        const areaDocente = docente ? docente.area : 'No especificada';
        const iniciales = obtenerIniciales(nombreDocente);
        
        const totalModulos = curso.modulos ? curso.modulos.length : 0;
        const totalLecciones = curso.modulos 
            ? curso.modulos.reduce((sum, mod) => sum + (mod.lecciones ? mod.lecciones.length : 0), 0) 
            : 0;

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-curso';
        tarjeta.onclick = () => mostrarDetalleCurso(curso.codigo);
        
        tarjeta.innerHTML = `
            <div class="curso-header">
                <h3 class="curso-nombre">${curso.nombre}</h3>
                <p class="curso-codigo">Código: ${curso.codigo}</p>
            </div>
            
            <div class="curso-body">
                <div class="docente-info">
                    <div class="docente-avatar">${iniciales}</div>
                    <div class="docente-datos">
                        <p class="docente-nombre">👨‍🏫 ${nombreDocente}</p>
                        <p class="docente-area">📌 ${areaDocente}</p>
                    </div>
                </div>
                
                <p class="curso-descripcion">${curso.descripcion}</p>
                
                <div class="estadisticas-curso">
                    <div class="stat-item">
                        <span class="stat-numero">${totalModulos}</span>
                        <span class="stat-label">Módulos</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-numero">${totalLecciones}</span>
                        <span class="stat-label">Lecciones</span>
                    </div>
                </div>
                
                <button class="btn-ver-detalles" onclick="event.stopPropagation(); mostrarDetalleCurso('${curso.codigo}')">
                    Ver Detalles Completos →
                </button>
            </div>
        `;
        
        container.appendChild(tarjeta);
    });
}

function obtenerIniciales(nombre) {
    const palabras = nombre.trim().split(' ');
    if (palabras.length >= 2) {
        return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
}

window.mostrarDetalleCurso = function(codigoCurso) {
    const sistema = read(DB_NAME);
    const curso = sistema.cursos.find(c => c.codigo === codigoCurso);
    
    if (!curso) {
        alert('❌ Curso no encontrado');
        return;
    }

    const docente = sistema.profesores.find(p => p.codigo === curso.docenteCodigo);
    const nombreDocente = docente ? `${docente.nombres} ${docente.apellidos}` : 'Sin docente';
    const emailDocente = docente ? docente.email : 'No disponible';
    const telefonoDocente = docente ? docente.telefono : 'No disponible';
    const areaDocente = docente ? docente.area : 'No especificada';

    const modal = document.getElementById('modalDetalleCurso');
    const detalles = document.getElementById('detallesCurso');

    detalles.innerHTML = `
        <div class="detalle-header">
            <h2>${curso.nombre}</h2>
            <p>Código: ${curso.codigo}</p>
        </div>
        
        <div class="detalle-body">
            <div class="seccion-detalle">
                <h3 class="seccion-titulo">📖 Descripción del Curso</h3>
                <p style="line-height: 1.8; color: #555;">${curso.descripcion}</p>
            </div>
            
            <div class="seccion-detalle">
                <h3 class="seccion-titulo">👨‍🏫 Información del Docente</h3>
                <div class="docente-info" style="display: block;">
                    <p style="margin: 8px 0;"><strong>Nombre:</strong> ${nombreDocente}</p>
                    <p style="margin: 8px 0;"><strong>Email:</strong> ${emailDocente}</p>
                    <p style="margin: 8px 0;"><strong>Teléfono:</strong> ${telefonoDocente}</p>
                    <p style="margin: 8px 0;"><strong>Área:</strong> ${areaDocente}</p>
                </div>
            </div>
            
            <div class="seccion-detalle">
                <h3 class="seccion-titulo">📚 Módulos y Lecciones</h3>
                ${generarModulosDetalle(curso)}
            </div>
        </div>
    `;

    modal.classList.add('activo');
};

function generarModulosDetalle(curso) {
    if (!curso.modulos || curso.modulos.length === 0) {
        return '<p style="text-align: center; color: #999; padding: 40px;">No hay módulos registrados en este curso</p>';
    }

    return curso.modulos.map(modulo => {
        const lecciones = modulo.lecciones || [];
        
        return `
            <div class="modulo-detalle">
                <h4>📂 ${modulo.nombre}</h4>
                <span class="modulo-codigo-badge">Código: ${modulo.codigo}</span>
                <p style="color: #666; margin: 10px 0;">${modulo.descripcion}</p>
                
                ${lecciones.length > 0 ? `
                    <div class="lecciones-lista">
                        <h5 style="color: #2c5282; margin-bottom: 10px;">📝 Lecciones (${lecciones.length}):</h5>
                        ${lecciones.map(leccion => `
                            <div class="leccion-item">
                                <div class="leccion-titulo">✏️ ${leccion.titulo}</div>
                                <div class="leccion-info">
                                    <strong>⏱️ Intensidad:</strong> ${leccion.intensidadHoraria} hora(s)
                                </div>
                                <div class="leccion-info" style="margin-top: 8px; line-height: 1.6;">
                                    <strong>📄 Contenido:</strong><br>
                                    ${leccion.contenido}
                                </div>
                                
                                ${leccion.multimedia && leccion.multimedia.length > 0 ? `
                                    <div style="margin-top: 12px;">
                                        <strong style="color: #555;">🔗 Recursos:</strong>
                                        <div class="recursos-multimedia">
                                            ${leccion.multimedia.map(recurso => {
                                                const iconos = {
                                                    'video': '🎥',
                                                    'pdf': '📄',
                                                    'imagen': '🖼️',
                                                    'enlace': '🔗'
                                                };
                                                return `
                                                    <a href="${recurso.url}" target="_blank" class="recurso-badge">
                                                        ${iconos[recurso.tipo] || '📎'} ${recurso.tipo.toUpperCase()}
                                                    </a>
                                                `;
                                            }).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : '<p style="color: #999; font-style: italic; padding: 10px 0;">No hay lecciones en este módulo</p>'}
            </div>
        `;
    }).join('');
}

window.cerrarModalDetalle = function() {
    const modal = document.getElementById('modalDetalleCurso');
    modal.classList.remove('activo');
};

// Cerrar modal al hacer clic fuera
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modalDetalleCurso');
    if (e.target === modal) {
        cerrarModalDetalle();
    }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cerrarModalDetalle();
    }
});