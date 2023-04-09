async function fetchBinSchedule(postcode, uprn) {
    const targetUrl = `https://www.nelincs.gov.uk/?s=${encodeURIComponent(postcode)}&uprn=${encodeURIComponent(uprn)}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
  
    try {
      const response = await fetch(proxyUrl);
      const data = await response.json();
      const html = data.contents;
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
  
  const postcode = 'Dn333aa';
  const uprn = '11020537';
  fetchBinSchedule(postcode, uprn)
    .then(binSchedule => displayNextCollection(binSchedule))
    .catch(error => console.error('Error:', error));  