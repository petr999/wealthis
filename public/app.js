Vue.filter("formatDate", function (d) {
  if (!window.Intl) return d
  return new Intl.DateTimeFormat("en-US").format(new Date(d))
})

const app = new Vue({
  el: "#app",
  data: {
    searchString: "",
    results: [],
    noResults: false,
    searching: false,
  },
  methods: {
    search: function () {
      this.searching = true
      fetch(
        `/api/v0/persons?searchString=${encodeURIComponent(this.searchString)}`
      )
        .then((res) => res.json())
        .then((res) => {
          this.searching = false
          this.data = res.data
          this.noResults = this.data.length === 0
        })
    },
  },
})
