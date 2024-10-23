let dataSet = [];

function renderBars(highlightIndices = []) {
    const container = document.getElementById('visualContainer');
    container.innerHTML = '';

    dataSet.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        if (highlightIndices.includes(index)) {
            bar.classList.add('red');
        }
        bar.style.height = `${value * 8}px`;
        bar.textContent = value;
        container.appendChild(bar);
    });
}

document.getElementById('loadRandomArray').addEventListener('click', () => {
    dataSet = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50) + 1);
    renderBars();
});

document.getElementById('loadArray').addEventListener('click', () => {
    const input = document.getElementById('numberArrayInput').value;
    dataSet = input.split(',').map(Number).filter(num => !isNaN(num));
    renderBars();
});

document.getElementById('bubbleSort').addEventListener('click', () => visualizeSort(bubbleSort, 'O(n²)'));
document.getElementById('selectionSort').addEventListener('click', () => visualizeSort(selectionSort, 'O(n²)'));
document.getElementById('insertionSort').addEventListener('click', () => visualizeSort(insertionSort, 'O(n²)'));
document.getElementById('quickSort').addEventListener('click', () => visualizeSort(quickSort, 'O(n log n)'));
document.getElementById('mergeSort').addEventListener('click', () => visualizeSort(mergeSort, 'O(n log n)'));

async function visualizeSort(sortFunction, bigONotation) {
    document.getElementById('bigOText').textContent = `Big-O Notation: ${bigONotation}`;
    await sortFunction();
    displaySortedMessage();
}

async function bubbleSort() {
    logMessage('Starting Bubble Sort');
    for (let i = 0; i < dataSet.length; i++) {
        for (let j = 0; j < dataSet.length - i - 1; j++) {
            if (dataSet[j] > dataSet[j + 1]) {
                swap(j, j + 1);
                renderBars([j, j + 1]);
                await sleep(300);
                logMessage(`Swapped ${dataSet[j + 1]} and ${dataSet[j]}`);
            }
        }
    }
}

async function selectionSort() {
    logMessage('Starting Selection Sort');
    for (let i = 0; i < dataSet.length; i++) {
        let min = i;
        for (let j = i + 1; j < dataSet.length; j++) {
            if (dataSet[j] < dataSet[min]) min = j;
        }
        if (min !== i) swap(i, min);
        renderBars([i, min]);
        await sleep(300);
        logMessage(`Swapped ${dataSet[i]} and ${dataSet[min]}`);
    }
}

async function insertionSort() {
    logMessage('Starting Insertion Sort');
    for (let i = 1; i < dataSet.length; i++) {
        let key = dataSet[i];
        let j = i - 1;
        while (j >= 0 && dataSet[j] > key) {
            dataSet[j + 1] = dataSet[j];
            j--;
            renderBars([j + 1, i]);
            await sleep(300);
            logMessage(`Moved ${dataSet[j + 1]} to index ${j + 2}`);
        }
        dataSet[j + 1] = key;
    }
}

async function quickSort() {
    logMessage('Starting Quick Sort');
    await quickSortHelper(0, dataSet.length - 1);
}

async function quickSortHelper(low, high) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
    }
}

async function partition(low, high) {
    const pivot = dataSet[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (dataSet[j] < pivot) {
            i++;
            swap(i, j);
            renderBars([i, j]);
            await sleep(300);
            logMessage(`Swapped ${dataSet[i]} and ${dataSet[j]}`);
        }
    }
    swap(i + 1, high);
    return i + 1;
}

async function mergeSort() {
    logMessage('Starting Merge Sort');
    await mergeSortHelper(0, dataSet.length - 1);
}

async function mergeSortHelper(left, right) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSortHelper(left, mid);
        await mergeSortHelper(mid + 1, right);
        await merge(left, mid, right);
    }
}

async function merge(left, mid, right) {
    const leftArr = dataSet.slice(left, mid + 1);
    const rightArr = dataSet.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
            dataSet[k] = leftArr[i];
            i++;
        } else {
            dataSet[k] = rightArr[j];
            j++;
        }
        renderBars([k]);
        await sleep(300);
        logMessage(`Placed ${dataSet[k]} at index ${k}`);
        k++;
    }

    while (i < leftArr.length) {
        dataSet[k] = leftArr[i];
        i++;
        k++;
        renderBars([k - 1]);
        await sleep(300);
        logMessage(`Placed ${dataSet[k - 1]} at index ${k - 1}`);
    }

    while (j < rightArr.length) {
        dataSet[k] = rightArr[j];
        j++;
        k++;
        renderBars([k - 1]);
        await sleep(300);
        logMessage(`Placed ${dataSet[k - 1]} at index ${k - 1}`);
    }
}

function swap(i, j) {
    [dataSet[i], dataSet[j]] = [dataSet[j], dataSet[i]];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function logMessage(message) {
    const logArea = document.getElementById('logEntries');
    logArea.innerHTML += `<p>${message}</p>`;
    logArea.scrollTop = logArea.scrollHeight;
}

function displaySortedMessage() {
    if (isArraySorted()) {
        document.getElementById('sortedMessage').textContent = 'Array is already sorted!';
    } else {
        document.getElementById('sortedMessage').textContent = '';
    }
}

function isArraySorted() {
    return dataSet.every((val, i, arr) => !i || arr[i - 1] <= val);
}
