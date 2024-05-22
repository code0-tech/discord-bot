const padString = (str, length, char = ' ') => {
    return str.padEnd(length, char);
}

class TableBuilder {
    constructor(columns, options = {}) {
        this._columns = [TableBuilder._createIndexColumn()];
        if (columns) {
            this._columns.push(...columns);
        }
        this._items = [];
        this._options = options;
    }

    addRows(...rows) {
        rows.forEach((row) => this._items.push(row));
    }

    build() {
        // Header
        let result = `\`${this._buildRow(this._createHeader())}\n`;
        result += padString('', this._totalWidth(), '―');
        // Content
        if (this._options.sortBy) {
            this._sortRows();
        }
        this._items.forEach((row, index) => {
            result += `\n${this._buildRow(row, index + 1)}`;
        });
        return `${result}\``;
    }

    _buildRow(data, index) {
        const keys = Object.keys(data).filter((key) => this._columns.find((col) => col.field === key));
        keys.sort((keyA, keyB) => {
            const colA = this._columns.find((col) => col.field === keyA);
            const colB = this._columns.find((col) => col.field === keyB);
            return colA.index - colB.index;
        });
        let result = index ? padString(String(index), TableBuilder._createIndexColumn().width) : '';
        keys.forEach((key) => {
            const column = this._columns.find((col) => col.field === key);
            let content = data[key];
            if (column.format && index) {
                content = column.format(data[key]);
            }
            result += padString(String(content), column.width);
        });
        return result;
    }

    _createHeader() {
        const header = {};
        this._columns.forEach((col) => {
            header[col.field] = col.label;
        });
        return header;
    }

    _totalWidth() {
        let width = 0;
        this._columns.forEach((col) => (width += col.width));
        return width;
    }

    _sortRows() {
        this._items.sort((a, b) => {
            let diff = 0;
            // Go through each of the sortBy columns, ordered in descending priority
            for (const columnField of this._options.sortBy) {
                const field = this._columns.find((col) => col.field === columnField).field;
                diff = this._compareValues(a[field], b[field]);
                // Only continue if the cells are equal in the current column
                if (diff !== 0) {
                    break;
                }
            }
            return diff;
        });
    }

    _compareValues(a, b) {
        // Find the label of the column to sort by
        if (this._options.sortDirection === 'desc') {
            [a, b] = [b, a];
        }
        if (typeof a === 'string') {
            return a.localeCompare(b);
        } else if (typeof a === 'number') {
            return a - b;
        } else if (a instanceof Date) {
            return a.getTime() - b.getTime();
        }
    }

    static _createIndexColumn() {
        return {
            index: 0,
            label: '#',
            width: 4,
            field: '#',
        };
    }
}

module.exports = { TableBuilder }