
class SimpleTable {
    constructor(columns) {
        this._columns = columns;
        this._stringOffset = 0;
        this._items = [];
        this._widthForKeys = {};
        this._verticalBar = false;
    }

    setStringOffset(offset = 2) {
        this._stringOffset = offset;
        return this;
    }

    addIndex(startValue = 1) {
        this._items = this._items.map((item, index) => {
            return { ...item, index: startValue + index };
        });

        this._columns.unshift({ label: '#', key: 'index' });
        this._widthForKeys['index'] = 0;

        return this;
    }

    setJsonArrayInputs(jsonArray) {
        jsonArray.forEach((row) => this._items.push(row));

        if (jsonArray.length > 0) {
            const keys = Object.keys(jsonArray[0]);
            keys.forEach((key) => {
                if (!(key in this._widthForKeys)) {
                    this._widthForKeys[key] = 0;
                }
            });
        }
        return this;
    }

    addVerticalBar(add = true) {
        this._verticalBar = add;
        return this;
    }

    updateWidthForKeys() {
        for (let key in this._widthForKeys) {
            const maxLength = Math.max(
                ...this._items.map(item => item[key].toString().length)
            );
            const columnLabelLength = this._columns.find(col => col.key === key)?.label.length || 0;
            this._widthForKeys[key] = Math.max(this._widthForKeys[key], maxLength, columnLabelLength) + this._stringOffset;
        }
    }

    extraSpaces(string, count) {
        const spacesToAdd = Math.max(0, count - string.length);
        return ' '.repeat(spacesToAdd);
    }

    stringExtraSpaces(string, count) {
        const spacesToAdd = Math.max(0, count - string.length);
        return string + ' '.repeat(spacesToAdd);
    }

    makeTopHeader() {
        let header = "`";

        this._columns.forEach(element => {
            header += `${this.stringExtraSpaces(element.label, this._widthForKeys[element.key])}`;
        });

        const headerLength = header.length;

        header += "`";

        if (this._verticalBar) {
            header += "\n`";
            header += "―".repeat(headerLength - 1);
            header += "`";
        }

        return header;
    }

    makeEntries() {
        let string = "";

        this._items.forEach(dataItem => {
            let row = "\n`";

            this._columns.forEach(column => {
                const columnKey = column.key;
                row += `${this.stringExtraSpaces(dataItem[columnKey].toString(), this._widthForKeys[columnKey])}`;
            });

            row += "`";
            string += row;
        });

        return string;
    }

    build() {
        this.updateWidthForKeys();

        let string = this.makeTopHeader();
        string += this.makeEntries();

        return string;
    }
}


module.exports = { SimpleTable };