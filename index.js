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

function parseCustomDateString(dateString) {
  const dateRegex = /^(\w+), (\d+)(?:\w{2}) (\w+) (\d{4})$/;
  const [, day, dayOfMonth, month, year] = dateString.match(dateRegex);

  const monthMap = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11
  };

  const monthIndex = monthMap[month];
  return new Date(year, monthIndex, dayOfMonth);
}

function filterFutureCollections(binSchedule) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return binSchedule.filter(({ collectionDate }) => {
    const collectionDateObj = parseCustomDateString(collectionDate);
    return collectionDateObj >= today;
  });
}

async function fetchBinSchedule(postcode, uprn) {
  const docRef = doc(db, 'binSchedules', `${postcode}_${uprn}`);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Raw bin schedule data from Firebase:', data.schedule);
      const futureSchedule = filterFutureCollections(data.schedule);
      console.log('Filtered future schedule:', futureSchedule);
      return futureSchedule;
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
  const collectionInfo = document.getElementById("collection-info");

  if (binSchedule && binSchedule.length > 0) {
    const { binType, collectionDate } = binSchedule[0];
    collectionInfo.innerHTML = `<i class="fas fa-trash-alt bin-icon"></i>${collectionDate}: ${binType}`;
  } else {
    collectionInfo.textContent = "No information available.";
  }
}

function displayUpcomingCollections(binSchedule) {
  const upcomingList = document.getElementById("upcoming-list");

  if (binSchedule && binSchedule.length > 1) {
    binSchedule.slice(1, 6).forEach(({ binType, collectionDate }) => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.innerHTML = `<i class="fas fa-trash-alt bin-icon"></i>${collectionDate}: ${binType}`;
      upcomingList.appendChild(listItem);
    });
  } else {
    upcomingList.textContent = "No information available.";
  }
}

const postcode = 'Dn333aa';
const uprn = '11020537';
fetchBinSchedule(postcode, uprn)
  .then((binSchedule) => {
    console.log('Bin schedule:', binSchedule);
    displayNextCollection(binSchedule);
    displayUpcomingCollections(binSchedule);
  })
  .catch((error) => console.error('Error:', error));