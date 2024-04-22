const actionTypes = {
    SET_COLOR: 'SET_COLOR',
    CLEAR: 'CLEAR',
    SELECT_ITEM: 'SELECT_ITEM',
};

const defaultState = {
    activeColor: undefined,
    items: {
        'item-0': [],
        'item-1': [],
        'item-2': [],
        'item-3': [],
        'item-4': [],
        'item-5': [],
        'item-6': [],
        'item-7': [],
        'item-8': [],
        'item-9': [],
        'item-10': [],
        'item-11': [],
        'item-12': [],
        'item-13': [],
        'item-14': [],
        'item-15': [],
    }
};

const store = Redux.createStore((state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.SET_COLOR:
            return {
                ...state,
                activeColor: action.color,
            };

        case actionTypes.SELECT_ITEM:
            // Toggle color
            if (state.items[action.id].includes(state.activeColor)) {
                return {
                    ...state,
                    items: {
                        ...state.items,
                        [action.id]: state.items[action.id].filter(color => color !== state.activeColor),
                    }
                };
            }

            // Don't allow more than 2 colors per word
            if (state.items[action.id].length >= 2) {
                return state;
            }

            return {
                ...state,
                items: {
                    ...state.items,
                    [action.id]: [...state.items[action.id], state.activeColor]
                }
            };

        case actionTypes.CLEAR:
            return defaultState;

        default:
            return state;
    }
});

store.subscribe(() => {
    const state = store.getState();
    Object.entries(state.items).forEach(([id, colors]) => {
        const item = document.getElementById(id);
        if (!item) {
            throw new Error(`Could not find element with id ${id}`);
        }

        item.classList.remove('purple', 'green', 'blue', 'yellow');
        item.classList.add(...colors);
    });

    document.querySelectorAll('#color-toolbar button').forEach(button => {
        button.classList.remove('active');
    });

    if (state.activeColor) {
        document.querySelector(`#color-toolbar .${state.activeColor}`).classList.add('active');
    }
});

document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', event => {
        store.dispatch({ type: actionTypes.SELECT_ITEM, id: event.target.id })
    });
});

document.querySelectorAll('#color-toolbar button').forEach(button => {
    button.addEventListener('click', event => {
        if (event.target.id === 'eraser') {
            store.dispatch({ type: actionTypes.CLEAR });
        } else {
            store.dispatch({ type: actionTypes.SET_COLOR, color: event.target.className });
        }
    });
});