export default class {
  constructor (filter, rowsPerPage = 10, page = 1) {
    this.filter = filter
    this.rowsPerPage = rowsPerPage
    this.page = page
  }

  getSkip () {
    return (this.rowsPerPage * this.page) - 1
  }
}
