// Adding the plugin
tinymce.PluginManager.add('synonym', function(editor, url){
  // fetch synonyms using Datamuse API
  editor.fetchSynonyms = function(searchTerm){

    let resultsDOM = document.getElementById('results')
    resultsDOM.innerHTML = "<div class = 'loader_body'><div class = 'loader'></div></div>"
    // sanitize the searchTerm
    let finalSearchTerm = searchTerm.replace(/ /g, '')
    let url = "https://api.datamuse.com/words?ml=" + finalSearchTerm

    fetch(url).then((response) =>{
      return response.json()
    }).then((data) => {
      let result_data = Array.from(data)
      editor.populateResults(result_data)
    })
  }

  // populating the results_area
  editor.populateResults = function(result_data) {

    let htmlStr = ""
    result_data.forEach(function(result_option) {
      htmlStr += "<div class = 'results_synonym'>"
      htmlStr += result_option.word
      htmlStr += "</div>"
    })

    let resultsDOM = document.getElementById('results')
    resultsDOM.innerHTML = htmlStr
  }

  //The synonym pop-up
  let synonymPopup = {

    title: 'Lookup Synoyms',
    body: {
      type: 'panel',
      items: [
        {
          type: 'htmlpanel',
          name: 'instruction',
          html: '<h5>Type in the word</h5>'
        },
        {
          type: 'input',
          name: 'search_word'
        },
        {
          type: 'htmlpanel',
          name: 'results_area',
          html: "<div class = 'results_body' id = 'results'><h4>Synonyms:</h4></div>"
        }
      ]
    },
    buttons: [],
    onSubmit: function(e){

      // e.preventDefault()
      let resultsDOM = document.getElementById('results')
      let data = e.getData()

      if(data.search_word.length != 0)
      {
        if(/^[a-zA-Z\s]*$/.test(data.search_word))
        {
          editor.fetchSynonyms(data.search_word)
        }
        else
          resultsDOM.innerHTML = "Please enter a valid word."
      }
      else
      { 
          resultsDOM.innerHTML = "Please enter a word in the input"
      }
    }
  }

  // Adding a button to the toolbar for synonym pop-up 
  editor.ui.registry.addButton('synonym', {

    text: "Lookup Synonyms",
    onAction: function(){
      // Opens a Pop-up window
      editor.windowManager.open(synonymPopup)
    }
  })

})

