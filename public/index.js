async function fetchBinSchedule(postcode, uprn) {
  const apiUrl = `/api/bin-schedule?postcode=${encodeURIComponent(postcode)}&uprn=${encodeURIComponent(uprn)}`;

  try {
    const response = await fetch(apiUrl);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
  
    const binSchedule = [];
    const items = doc.querySelectorAll('ul.list-group-flush li.bin-collection-item');
    items.forEach((element) => {
      const binType = element.querySelector('div:last-child > div:last-child').textContent.trim();
      const collectionDate = element.querySelector('div:last-child > h3').textContent.trim();

      binSchedule.push({ binType, collectionDate });
    });

    return binSchedule;
    } catch (error) {
      console.error('Error fetching bin schedule:', error);
      return null;
    }
  }
  
  function displayNextCollection(binSchedule) {
    const collectionInfo = document.getElementById('collection-info');
    if (binSchedule && binSchedule.length > 0) {
      const { binType, collectionDate } = binSchedule[0];
      collectionInfo.innerHTML = `<i class="fas fa-trash-alt bin-icon"></i>${collectionDate}: ${binType}`;
    } else {
      collectionInfo.textContent = 'No information available.';
    }
  }

  function displayUpcomingCollections(binSchedule) {
    const upcomingList = document.getElementById('upcoming-list');
  
    if (binSchedule && binSchedule.length > 1) {
      binSchedule.slice(1, 6).forEach(({ binType, collectionDate }) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `<i class="fas fa-trash-alt bin-icon"></i>${collectionDate}: ${binType}`;
        upcomingList.appendChild(listItem);
      });
    } else {
      upcomingList.textContent = 'No information available.';
    }
  }
  
  const postcode = 'Dn333aa';
  const uprn = '11020537';
  fetchBinSchedule(postcode, uprn)
    .then((binSchedule) => {
      displayNextCollection(binSchedule);
      displayUpcomingCollections(binSchedule);
  })
  .catch((error) => console.error('Error:', error));  