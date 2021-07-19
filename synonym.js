// Adding the Synonym Plugin
tinymce.PluginManager.add('synonym', function(editor, url) {
  
  // Click callback to insert the selected word into the editor
  let insertSynonym = function(e) {

    e.stopPropagation()

    editor.insertContent(e.target.textContent)
    editor.windowManager.close()
  }

  // Fetching synonyms using Datamuse API
  editor.fetchSynonyms = function(searchTerm) {

    let resultsDOM = document.getElementById('results')
    resultsDOM.innerHTML = "<div id = 'loader_body'><div id = 'loader'></div></div>"
    // using datamuse API to retrieve synonyms & related words
    let url = "https://api.datamuse.com/words?ml=" + searchTerm

    fetch(url).then((response) => {
      return response.json()
    }).then((data) => {
      editor.populateResults(data)
    })
  }

  // Populating the results_area
  editor.populateResults = function(result_data) {

    let resultsDOM = document.getElementById('results')

    if(result_data.length == 0)
    { 
        resultsDOM.innerHTML = "No synonym found, Please try entering a correct word"
    }
    else
    {
      let htmlStr = ""
      result_data.forEach(function(result_option) {
        htmlStr += "<div class = 'results_synonym'>"
        htmlStr += result_option.word
        htmlStr += "</div>"
      })

      resultsDOM.innerHTML = htmlStr
      resultsDOM.addEventListener('click', insertSynonym)
    }
  }

  // The Synonym Pop-up
  let synonymPopup = {

    title: 'Lookup Synonyms',
    body: {
      type: 'panel',
      items: [
        {
          type: 'htmlpanel',
          name: 'instructions',
          html: "<div id = instruct><h3>Please type in a word:</h3></div>"
        },
        {
          type: 'input',
          name: 'search_word'
        },
        {
          type: 'htmlpanel',
          name: 'results_area',
          html: "<div id = 'results_body'><h2>Synonyms:</h2><div id = 'results'></div></div>"
        }
      ]
    },
    buttons: [],
    onSubmit: function(e) {

      let resultsDOM = document.getElementById('results')
      let data = e.getData()

      // checking if the entered word is valid
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
          resultsDOM.innerHTML = "Please enter a word before submitting."
      }
    }
  }

  // Adding the button for Synonym Pop-up to the toolbar 
  editor.ui.registry.addButton('synonym', {

    text: "Lookup Synonyms",
    onAction: function() {
      // opens the Pop-up window
      editor.windowManager.open(synonymPopup)
    }
  })

})

