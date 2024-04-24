const actionTypes = {
    SET_ITEMS: 'SET_ITEMS',
    SET_COLOR: 'SET_COLOR',
    CLEAR: 'CLEAR',
    SELECT_ITEM: 'SELECT_ITEM',
};

const defaultState = {
    activeColor: undefined,
    items: [],
};

const store = Redux.createStore((state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.SET_ITEMS:
            return {
                ...state,
                items: action.items.map((item, idx) => new Item(idx, item)),
            };

        case actionTypes.SET_COLOR:
            return {
                ...state,
                activeColor: action.color === state.activeColor ? undefined : action.color,
            };

        case actionTypes.SELECT_ITEM:
            if(!state.activeColor) {
                return state;
            }

            return {
                ...state,
                items: state.items.map(item => item.id === action.id ? item.toggleColor(state.activeColor) : item),
            };

        case actionTypes.CLEAR:
            return {
                ...defaultState,
                items: state.items.map(item => new Item(item.id, item.word)),
            };

        default:
            return state;
    }
});

store.subscribe(() => {
    const state = store.getState();

    render(state.items);
    
    document.querySelectorAll('#color-toolbar button').forEach(button => button.classList.remove('active'));

    if (state.activeColor) {
        document.querySelector(`#color-toolbar .${state.activeColor}`).classList.add('active');
    }
});

document.querySelectorAll('#color-toolbar button').forEach(button => {
    button.addEventListener('click', event => {
        if (event.target.id === 'eraser') {
            store.dispatch({ type: actionTypes.CLEAR });
        } else {
            store.dispatch({ type: actionTypes.SET_COLOR, color: event.target.id });
        }
    });
});

fetch('/api/connections').then(response => response.json()).then(items => {
    store.dispatch({ type: actionTypes.SET_ITEMS, items });
    // TODO: move these also to the subscribe
    document.getElementById('loader-container').remove();
    document.querySelectorAll('button').forEach(button => button.disabled = false);
});

function render(items) {
    const chunkedItems = chunkItems(items);
    chunkedItems.forEach((chunk, chunkIdx) => {
        const row = document.getElementById(`row-${chunkIdx}`);
        row.innerHTML = '';
        chunk.forEach((item) => row.appendChild(createItemElement(item)));
    });
}

function chunkItems(items) {
    const chunkedItems = [];
    for (let i = 0; i < items.length; i += 4) {
        chunkedItems.push(items.slice(i, i + 4));
    }
    return chunkedItems;
}

function createItemElement({ id, word, colors }) {
    const el = document.createElement('div');
    el.classList.add('item', ...colors);
    el.id = `item-${id}`;
    el.textContent = word;

    el.addEventListener('click', () => store.dispatch({ type: actionTypes.SELECT_ITEM, id }));

    return el;
}

class Item {
    constructor(id, word, colors = []) {
        this.id = id;
        this.word = word;
        this.colors = colors;
    }

    toggleColor(color) {
        if(this.colors.includes(color)) {
            return new Item(this.id, this.word, this.colors.filter(c => c !== color));
        }

        if (this.colors.length >= 2) {
            return this;
        }

        return new Item(this.id, this.word, [...this.colors, color]);
    }
}