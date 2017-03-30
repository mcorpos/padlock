(() => {

const Record = padlock.data.Record;

function filterByString(fs, rec) {
    const words = fs.toLowerCase().split(" ");

    // For the record to be a match, each word in the filter string has to appear
    // in either the category or the record name.
    for (var i = 0, match = true; i < words.length && match; i++) {
        match = rec.category && rec.category.toLowerCase().search(words[i]) != -1 ||
            rec.name.toLowerCase().search(words[i]) != -1;
    }

    return !!match;
}

class ListView extends Polymer.Element {
    static get is() { return "pl-list-view"; }

    static get properties() { return {
        _filterString: {
            type: String,
            value: ""
        },
        records: Array,
    }; }

    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            this._resized();
        }, 100);
        window.addEventListener("resize", this._resized.bind(this));
    }

    _computeFilter(filterString) {
        return (record) => {
            return record.padding || !record.removed && filterByString(filterString, record);
        };
    }

    _sortRecords(a, b) {
        return Record.compare(a, b);
    }

    _isEmpty() {
        return !this.records.length;
    }

    _isDark(i) {
        const nRow = Math.floor(i / this._nCols);

        if (!(this._nCols % 2) && nRow % 2) {
            i++;
        }

        return !(i % 2);
    }

    _recordTapped(e) {
        this.dispatchEvent(new CustomEvent("record-select", { detail: { record: e.model.item } }));
    }

    _resized() {
        const width = this.offsetWidth;
        const recMinWidth = 250;
        this._nCols = Math.floor(width / recMinWidth);
    }

    _openMenu() {
        this.dispatchEvent(new CustomEvent("open-menu"));
    }

    _newRecord() {
        this.dispatchEvent(new CustomEvent("record-new"));
    }

    _paddedRecords() {
        const records = this.records.slice();
        while (records.length % this._nCols) {
            records.push({ padding: true });
        }
        return records;
    }
}

window.customElements.define(ListView.is, ListView);

})();