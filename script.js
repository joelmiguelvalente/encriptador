/**
 * Implementación de dark mode
 * Activar con Shift + D
 * window.matchMedia
 * https://developer.mozilla.org/es/docs/Web/API/Window/matchMedia
*/
let encriptadorTipo;
const darkTheme = 'mode-dark';
const modeSelected = localStorage.getItem('dark-mode');
const themeCurrent = () => document.body.classList.contains(darkTheme) ? 'mode-dark' : 'mode-light';
if (modeSelected) {
	document.body.classList[modeSelected === 'mode-dark' ? 'add' : 'remove'](darkTheme)
} else {
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) 
		document.body.classList.add(darkTheme)
}
// Cerramos modal con ESC
document.onkeydown = tecla => {
	if(tecla.shiftKey && tecla.keyCode === 68) {
  		document.body.classList.toggle(darkTheme);
  		localStorage.setItem('dark-mode', themeCurrent());
	}
};
/**
 * Navegacion
*/
const enlaces = [].slice.call(document.querySelectorAll(".menu-navegacion li a"));
enlaces.map( enlace => {
	enlace.addEventListener('click', evento => {
		enlaces.map( enlace => enlace.classList.remove('activo'))
		evento.preventDefault()
		enlace.classList.add('activo')
		encriptadorTipo = enlace.dataset.encriptador
		document.querySelector(".area-input h3 b").innerHTML = encriptadorTipo
	})
})
/**
 * Obtenemos todos los inputs/campos
*/
const mensaje = document.getElementById("input"),
mostrar = document.querySelector(".resultado-ver"),
resultado = document.getElementById("resultado"),
// Botones
boton_encriptar = document.getElementById("encriptar"),
boton_desencriptar = document.getElementById("desencriptar"),
boton_copiar = document.getElementById("copiar");

mensaje.addEventListener('keyup', tecla => {
	mostrar.style.display = 'none'
   //Tecla para borrar y espacio permitidas
   if (tecla.code === 'Backspace' || tecla.code === 'Space') return true;
   // Solo acepta numeros y letras
   return /[A-Za-z0-9]/.test(String.fromCharCode(tecla.keyCode));
})

/**
 * Informacion sobre objetos
 * https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Working_with_Objects
*/
var mapObjVocal = { a: "ai", e: "enter", i: "imes", o: "ober", u: "ufat" };
var mapObjClave = { ai: "a", enter: "e", imes: "i", ober: "o", ufat: "u" };

var regexV = /a|e|i|o|u/img;
var regexC = /ai|enter|imes|ober|ufat/img;

/*function codificar_avanzado(texto) {
  	var array = [];
  	for (var letra = texto.length-1; letra >= 0 ; letra--) {
  		content = (texto[letra].charCodeAt() === 32) ? ' ' : texto[letra].charCodeAt() + ','
    	array.unshift([content].join(''));
  	}
  	return array.join('');
}
//Metodo Decode
function descodificarEntidad(texto) {
  	return texto.replace(/(\d+),/g, (match, dec) => String.fromCharCode(dec));
}*/

function reemplazar(accion, texto) {
	if(encriptadorTipo === 'avanzado') {
		// codifica
		if(accion) {
			var array = [];
		  	for (var letra = texto.length-1; letra >= 0 ; letra--) {
		  		content = (texto[letra].charCodeAt() === 32) ? ' ' : texto[letra].charCodeAt() + ','
		    	array.unshift([content].join(''));
		  	}
		  	return array.join('');
		// decodifica
		} else {
			return texto.replace(/(\d+),/g, (match, dec) => String.fromCharCode(dec));
		}
	} else {
		return texto.replace((accion ? regexV : regexC), matched => (accion ? mapObjVocal[matched] : mapObjClave[matched]));
	}
}

// Continuamos
var continuar = true;

function generador(accion) {
	var nuevo = [];
   var letra = mensaje.value;
   var coma = 44, espacio = 32;

   var empieza = (encriptadorTipo !== 'avanzado') ? 97 : ((!accion) ? 48 : 97);
   var termina = (encriptadorTipo !== 'avanzado') ? 122 : ((!accion) ? 57 : 122);

   continuar = true;
	letra.split('').filter(word => {
		if((empieza > word.charCodeAt(0) || termina < word.charCodeAt(0)) && word.charCodeAt(0) != espacio && word.charCodeAt(0) != coma) {
			alert('No permitido: ' + word)
			continuar = false;
		}
	});
  	if(continuar) {
		// Forzamos a minusculas
		letra = letra.toLowerCase()
		// Buscamos y reemplazamos
		letra = reemplazar(accion, letra);

		resultado.innerHTML = letra;
		mensaje.value = '';
		if(accion) {
			boton_encriptar.classList.add('wait')
			boton_encriptar.innerHTML += ' <span id="load"><i></i> espere...</span>'
		} else {
			boton_desencriptar.classList.add('wait')
			boton_desencriptar.innerHTML += ' <span id="load"><i></i> espere...</span>'
		}
		setTimeout(() => {
			if(accion) {
				boton_encriptar.classList.remove('wait')
				boton_encriptar.removeChild(document.getElementById("load"))
			} else {
				boton_desencriptar.classList.remove('wait')
				boton_desencriptar.removeChild(document.getElementById("load"))
			}
			if(screen.width <= 560) {
				/*
				 * https://developer.mozilla.org/es/docs/Web/API/Element/clientHeight
				*/
				window.scroll({
				  	top: document.querySelector(".area-input").offsetHeight + 20,
				  	behavior: 'smooth'
				})
			}
			mostrar.removeAttribute('style')
		}, 2000) // 2s
	}
}

function copiar(){
	const resultado = document.getElementById("resultado")
   resultado.removeAttribute("disabled")
   resultado.select();
   // Por alguna razón no me funciona
  	navigator.clipboard.writeText(resultado.value)
  	// if(document.execCommand("copy")) resultado.setAttribute("disabled", "")
}

boton_encriptar.addEventListener('click', () => generador(true))
boton_desencriptar.addEventListener('click', () => generador(false))
boton_copiar.addEventListener('click', () => copiar())