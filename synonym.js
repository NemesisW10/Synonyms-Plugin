// Adding the plugin
tinymce.PluginManager.add("synonym", function(editor, url){
  // fetch API for Synonyms
  function fetchSynonyms(searchTerm){
    //final url after searchWord is sanitized
    url = "https://api.datamuse.com/words?ml=" + searchTerm
    let searchResults = []
    //fetching the searchResults
    fetch(url).then((response) =>{
      return response.json()
    }).then((data) => {

      for(let i = 0; i < Math.min(data.length, 10); i++)
      {
        let elem = {}
        elem['value'] = data[i].word 
        elem['text'] = data[i].word

        searchResults.push(elem)
      }
    })

    return searchResults;
  }
  // Synonym Pop-up
  let openPopup = {
      title: 'Lookup Synoyms',
      name: 'popup_window',
      body: {
        type: 'panel',
        items: [
          {
            type: 'input',
            name: 'inp_word',
          },
          {
            type: 'selectbox',
            name: 'select_synonym',
            label: 'Synonyms:',
            disabled: true,
            items: [],
            onselect: function(e){
              console.log(this.value)
              editor.insertContent(this.value)
            },
          }
        ]
      },
      buttons: [
        {
          type: 'submit',
          name: 'search_btn',
          text: 'search',
        }
      ],

      onSubmit: function(popup){
        console.log('changed')
        let data = popup.getData()

        if(data.inp_word.length != 0)
        {
          if(/^[a-zA-Z\s]*$/.test(data.inp_word))
          {
            let result = fetchSynonyms(data.inp_word)
            popup.setData(openPopup.body.items[1].items = result)
            popup.setData(openPopup.body.items[1].disabled = false)
            //insert synonym
          }
          else
            alert("Please enter a valid word")
        }
        else
        { 
           alert("Please enter a word in the input")
        }
      },
    }
  // Adding a button for Pop-up 
  editor.ui.registry.addButton("synonym", {
    text: "Lookup Synonyms",
    onAction: function(){
      // Open a Pop-up window
      editor.windowManager.open(openPopup);
    }
  })

})

