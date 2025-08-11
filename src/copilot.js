const canvas = document.getElementById("canvas");
let nodes = [];
let wires = [];

// Estado para arrastrar nodos
let draggingNode = null;
let dragOffset = { x: 0, y: 0 };

// Estado para conectar puertos
let connecting = false;
let connectStart = null; // {node, portType, portElem}
let tempWire = null;

function createNode(x, y, label, entradas=1, salidas=1) {
	const id = nodes.length + 1;
	const node = document.createElement('div');
	node.className = 'node';
	node.style.position = 'absolute';
	node.style.left = x + 'px';
	node.style.top = y + 'px';
	node.style.background = '#222';
	node.style.borderRadius = '8px';
	node.style.boxSizing = 'border-box';
	node.style.display = 'inline-flex'; // Para que crezca según el contenido
	node.style.flexDirection = 'column';
	node.style.justifyContent = 'center';
	node.style.alignItems = 'center';
	node.style.cursor = 'grab';
	node.style.padding = '16px';
	node.style.minWidth = '60px';
	node.style.minHeight = '32px';
	node.style.userSelect = 'none';

	// Contenedor relativo para puertos
	const nodeContent = document.createElement('div');
	nodeContent.style.position = 'relative';
	nodeContent.style.display = 'flex';
	nodeContent.style.flexDirection = 'column';
	nodeContent.style.alignItems = 'center';

	// LaTeX label
	const labelDiv = document.createElement('div');
	labelDiv.className = 'latex-label';
	labelDiv.innerHTML = `$$${label}$$`;
	labelDiv.style.display = 'inline-block';
	nodeContent.appendChild(labelDiv);

	node.appendChild(nodeContent);
	document.getElementById('canvas-container').appendChild(node);
	nodes.push({ id, node, x, y });

	// Puertos de entrada (arriba, centrados)
	const inputBar = document.createElement('div');
	inputBar.style.position = 'absolute';
	inputBar.style.left = '0';
	inputBar.style.top = '-10px';
	inputBar.style.width = '100%';
	inputBar.style.display = 'flex';
	inputBar.style.justifyContent = entradas === 1 ? 'center' : 'space-between';
	inputBar.style.pointerEvents = 'none';
	for (let i = 0; i < entradas; i++) {
		const port = document.createElement('div');
		port.className = 'port input';
		port.style.width = '12px';
		port.style.height = '12px';
		port.style.background = '#ff0';
		port.style.borderRadius = '50%';
		port.style.pointerEvents = 'auto';
		inputBar.appendChild(port);
	}
	nodeContent.appendChild(inputBar);

	// Puertos de salida (abajo, centrados)
	const outputBar = document.createElement('div');
	outputBar.style.position = 'absolute';
	outputBar.style.left = '0';
	outputBar.style.bottom = '-10px';
	outputBar.style.width = '100%';
	outputBar.style.display = 'flex';
	outputBar.style.justifyContent = salidas === 1 ? 'center' : 'space-between';
	outputBar.style.pointerEvents = 'none';
	for (let i = 0; i < salidas; i++) {
		const port = document.createElement('div');
		port.className = 'port output';
		port.style.width = '12px';
		port.style.height = '12px';
		port.style.background = '#ff0';
		port.style.borderRadius = '50%';
		port.style.pointerEvents = 'auto';
		outputBar.appendChild(port);
	}
	nodeContent.appendChild(outputBar);

	// Drag & drop robusto SOLO sobre el nodo (no sobre los puertos)
	let offsetX = 0, offsetY = 0;
	node.addEventListener('mousedown', (e) => {
		if (e.button !== 0) return;
		if (e.target.classList.contains('port')) return;
		draggingNode = node;
		offsetX = e.clientX - node.offsetLeft;
		offsetY = e.clientY - node.offsetTop;
		document.body.style.userSelect = 'none';
		node.style.zIndex = '1000';
		node.style.cursor = 'grabbing';
		e.preventDefault();
	});
	document.addEventListener('mousemove', onDrag);
	document.addEventListener('mouseup', onDrop);
	function onDrag(e) {
		if (draggingNode === node) {
			node.style.left = (e.clientX - offsetX) + 'px';
			node.style.top = (e.clientY - offsetY) + 'px';
		}
	}
	function onDrop() {
		if (draggingNode === node) {
			draggingNode = null;
			document.body.style.userSelect = '';
			node.style.cursor = 'grab';
			node.style.zIndex = '';
			document.removeEventListener('mousemove', onDrag);
			document.removeEventListener('mouseup', onDrop);
		}
	}

	// Ajustar tamaño del nodo después de renderizar LaTeX
	if (window.MathJax && window.MathJax.typesetPromise) {
		window.MathJax.typesetPromise([labelDiv]).then(() => {
			// El nodo crece automáticamente, pero si quieres puedes forzar un mínimo
			node.style.minWidth = '60px';
			node.style.minHeight = '32px';
		});
	}
}

window.addEventListener('mousemove', (e) => {
	if (draggingNode) {
		draggingNode.style.left = (e.clientX - offsetX) + 'px';
		draggingNode.style.top = (e.clientY - offsetY) + 'px';
	}
});

window.addEventListener('mouseup', () => {
	if (draggingNode) {
		draggingNode.style.cursor = 'grab';
		draggingNode = null;
		document.body.style.userSelect = '';
	}
});

window.addEventListener('keydown', (e) => {
	if (e.key === 'n' || e.key === 'N') {
		const label = prompt('Nombre del nodo:', '') || '';
		let entradas = parseInt(prompt('¿Cuántas entradas?', '1'), 10);
		if (isNaN(entradas) || entradas < 0) entradas = 1;
		let salidas = parseInt(prompt('¿Cuántas salidas?', '1'), 10);
		if (isNaN(salidas) || salidas < 0) salidas = 1;
		let x = window.innerWidth / 2 - 50;
		let y = window.innerHeight / 2 - 30;
		if (window._lastMouse) {
			x = window._lastMouse.x - 50;
			y = window._lastMouse.y - 30;
		}
		createNode(x, y, label, entradas, salidas);
	}
});

window._lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
window.addEventListener('mousemove', (e) => {
	window._lastMouse = { x: e.clientX, y: e.clientY };
});