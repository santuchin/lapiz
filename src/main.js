let currentNode = null;
let selectedNode = null
let offsetX = 0, offsetY = 0;
let lastMouseX = 0, lastMouseY = 0;

function createNode(name) {
    const node = document.createElement('div');
    node.className = 'node';

    const sign = document.createElement('div');
    node.appendChild(sign);
    sign.className = 'sign';

    const input = document.createElement('div');
    node.appendChild(input);
    input.className = 'input';

    const output = document.createElement('div');
    node.appendChild(output);
    output.className = 'output';

    const circle_input = document.createElement('div');
    circle_input.className = 'circle';
    circle_input.style.top = '10%';
    input.appendChild(circle_input);

    const circle_output = document.createElement('div');
    circle_output.className = 'circle';
    circle_output.style.top = '89%';
    output.appendChild(circle_output);

	node.addEventListener('mousedown', function(e) {
        dragNode(node, e.clientX, e.clientY);
	});

    sign.textContent = name;
	
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    let x = lastMouseX - canvasRect.left;
    let y = lastMouseY - canvasRect.top;
    node.style.position = 'absolute';
    node.style.left = x + 'px';
    node.style.top = y + 'px';

    document.getElementById('canvas').appendChild(node);
}

function dragNode(node, x, y) {
    currentNode = node;
    selectedNode = node;
    node.get.style.zIndex = 3
    const rect = node.getBoundingClientRect();
    offsetX = x - rect.left;
    offsetY = y - rect.top;
    node.style.zIndex = 10;
    document.body.style.userSelect = 'none';
}

document.addEventListener('mousemove', function(e) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    if (!currentNode) return;
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    let x = e.clientX - canvasRect.left - offsetX;
    let y = e.clientY - canvasRect.top - offsetY;
    currentNode.style.position = 'absolute';
    currentNode.style.left = x + 'px';
    currentNode.style.top = y + 'px';
});

document.addEventListener('mouseup', function() {
    if (currentNode) {
        currentNode.style.zIndex = '';
        document.body.style.userSelect = '';
        currentNode = null;
    }
});

document.addEventListener('keydown', function(event) {

    switch (event.key) {
        
        case 'n':
            createNode(prompt('name'));
            break;
        
        case 'Backspace':
            if (selectedNode) {
                selectedNode.remove();
                selectedNode = null;
            }
            break;
    }
});

