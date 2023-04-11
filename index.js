// Import the Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getFirestore, collection, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

// Your Firebase web app's configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDoUxyDRXnpoVy0AdgKXyz-pZ8_MgRyaA",
  authDomain: "bin-schedule.firebaseapp.com",
  projectId: "bin-schedule",
  storageBucket: "bin-schedule.appspot.com",
  messagingSenderId: "983381376891",
  appId: "1:983381376891:web:1a89715572c0a9d12387de",
  measurementId: "G-6Z19EZW15H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchBinSchedule(postcode, uprn) {
  const docRef = doc(db, 'binSchedules', `${postcode}_${uprn}`);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.schedule;
    } else {
      console.error('No bin schedule data found in Firebase.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching bin schedule from Firebase:', error);
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