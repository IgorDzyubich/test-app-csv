import './App.css'
import file from './MOCK_DATA.csv'

// I have decided not to use 'csv-file-validator', instead of that I used Vanilla JS

function App() {

  function validateData(col, data) {
    let regExp

    switch (col) {
      case 0:
        regExp = /^[a-zA-Z ]+$/
        if (!data) {
          createErrorMsg()
          throw new Error('File format is not correct!')
        } else if (!regExp.test(data)) {
          return false
        } else {
          return true
        }
      case 1:
        regExp = /^\+(?:[1] ?)[0-9\s]{13}$/
        if (!data) {
          createErrorMsg()
          throw new Error('File format is not correct!')
        } else if (!regExp.test(data)) {
          return false
        } else {
          return true
        }
      case 2:
        regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!data) {
          createErrorMsg()
          throw new Error('File format is not correct!')
        } else if (!regExp.test(data?.toLowerCase())) {
          return false
        } else {
          return true
        }
      case 3:
        if (Number.isInteger(+data) && +data >= 21) {
          return true
        } else {
          return false
        }
      case 4:
        if (Number.isInteger(+data) && +data >= 0 && +data <= 21) {
          return true
        } else {
          return false
        }
      case 5:
        if (+data <= 1000000 && data.split('.')[1]?.length === 2) {
          return true
        } else {
          return false
        }
      case 6:
        if (data === 'TRUE' || data === 'FALSE') {
          return true
        } else if (data === '') {
          data = false
          return true
        } else {
          return false
        }
      case 7:
        regExp = /^[A-Z]{2}$/
        if (!regExp.test(data)) {
          return false
        } else {
          return true
        }
      case 8:
        if (data.split('/')[0]?.length === 4) {
          regExp = /^\d{4}[/](0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])$/
          if (!regExp.test(data)) {
            return false
          } else {
            return true
          }
        } else {
          regExp = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
          if (!regExp.test(data)) {
            return false
          } else {
            return true
          }
        }
      case 9:
        regExp = /^[\d]{1}[a-z]{2}[\d]{3}$/
        if (!regExp.test(data)) {
          return false
        } else {
          return true
        }
      default:
        break
    }
  }

  function createErrorMsg() {
    if (!document.querySelector('.error')) {
      const errorBlock = document.createElement('div')
      errorBlock.classList.add('error')
      errorBlock.innerText = 'File format is not correct!'
      document.querySelector('.App').append(errorBlock)
    }
  }

  const getUsers = async () => {
    
    try {
      const response = await fetch(file)
      if (!file.split('.')[2] === 'csv') {
        createErrorMsg()
      }
      const Data = (await response.text()).trim()
      makeTable(Data)
    } catch (error) {
      console.log(error)
    }

  }

  function makeTable(csv) {
    const rows = csv.split('\n')
    const table = document.createElement('table')
    const phones = []
    const emails = []
    let tr = null,
      td = null,
      tds = null

    for (let i = 0; i < rows.length; i++) {
      if (i === 0) {
        tr = document.createElement('tr')
        tr.classList.add('tHead')
        tds = rows[i].split(',')
        for (let j = 0; j < tds.length; j++) {
          if (j === 0) {
            td = document.createElement('td')
            td.classList.add(`tCol${i}-Id`)
            td.innerHTML = 'ID'
            tr.appendChild(td)
            td = document.createElement('td')
            td.classList.add(`tCol${i}-${j}`)
            td.innerHTML = tds[j].trim()
            tr.appendChild(td)
          } else if (j === tds.length - 1) {
            td = document.createElement('td')
            td.classList.add(`tCol${i}-${j}`)
            td.innerHTML = tds[j].trim()
            tr.appendChild(td)
            td = document.createElement('td')
            td.classList.add(`tCol${i}-${j + 1}`)
            td.innerHTML = 'Duplicate with'
            tr.appendChild(td)
          } else {
            td = document.createElement('td')
            td.classList.add(`tCol${i}-${j}`)
            td.innerHTML = tds[j].trim()
            tr.appendChild(td)
          }
        }
        table.appendChild(tr)
      } else {
        tr = document.createElement('tr')
        tds = rows[i].split(',')
        for (let j = 0; j < tds.length; j++) {
          if (j === 0) {
            td = document.createElement('td')
            td.classList.add(`tCol${i}-Id`)
            td.innerHTML = i
            tr.appendChild(td)
            td = document.createElement('td')
            td.classList.add(`tCol${i}-${j}`)
            if (!validateData(j, tds[j].trim())) {
              td.classList.add(`err`)
            }
            td.innerHTML = tds[j].trim()
            tr.appendChild(td)
          } else if (j === tds.length - 1) {
            td = document.createElement('td')
            td.classList.add(`tCol${i}-${j}`)
            if (!validateData(j, tds[j].trim())) {
              td.classList.add(`err`)
            }
            td.innerHTML = tds[j].trim()
            tr.appendChild(td)
            td = document.createElement('td')
            td.classList.add(`tCol${i}-${j + 1}`)
            // td.innerHTML = 'X'
            tr.appendChild(td)
          } else {
            td = document.createElement('td')
            td.classList.add(`tCol${i}-${j}`)
            if (!validateData(j, tds[j].trim())) {
              td.classList.add(`err`)
            }
            if (j === 1) {
              phones.push(tds[j].trim())
            }
            if (j === 2) {
              emails.push(tds[j].trim())
            }
            td.innerHTML = tds[j].trim()
            tr.appendChild(td)
          }
        }
        table.appendChild(tr)
      }
    }

    document.querySelector('.App').append(table)
    findDuplicate(phones, emails)

  }

  function findDuplicate(phones, emails) {

    for (let i = 0; i < phones.length; i++) {
      const element = phones[i]
      for (let j = 0; j < phones.length; j++) {
        if (i !== j) {
          if (element === phones[j]) {
            document.querySelector(`.tCol${i + 1}-10`).innerHTML = `${j + 1}`
          }
        }
      }
    }

    for (let i = 0; i < emails.length; i++) {
      const element = emails[i]
      for (let j = 0; j < emails.length; j++) {
        if (i !== j) {
          if (element === emails[j]) {
            document.querySelector(`.tCol${i + 1}-10`).innerHTML = `${j + 1}`
          }
        }
      }
    }

  }

  return (
    <div className="App">
      <button className="btn" onClick={getUsers}>
        Import users
      </button>
    </div>
  )
}

export default App