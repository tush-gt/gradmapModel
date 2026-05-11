// src/services/api.js

const mockColleges = [
  { code: '3012', name: 'VJTI Mumbai', district: 'Mumbai', type: 'Government Aided' },
  { code: '3014', name: 'Sardar Patel Institute of Technology (SPIT)', district: 'Mumbai', type: 'Un-Aided Autonomous' },
  { code: '3181', name: 'K. J. Somaiya College of Engineering', district: 'Mumbai', type: 'Un-Aided Autonomous' },
  { code: '3199', name: 'Dwarkadas J. Sanghvi College of Engineering', district: 'Mumbai', type: 'Un-Aided' },
  { code: '6006', name: 'College of Engineering Pune (COEP)', district: 'Pune', type: 'Government Autonomous' },
  { code: '6271', name: 'Pune Institute of Computer Technology (PICT)', district: 'Pune', type: 'Un-Aided' },
  { code: '6273', name: 'BRACT\'S Vishwakarma Institute of Technology (VIT)', district: 'Pune', type: 'Un-Aided Autonomous' },
  { code: '6004', name: 'Government College of Engineering, Pune', district: 'Pune', type: 'Government' },
  { code: '4004', name: 'Government College of Engineering, Amravati', district: 'Amravati', type: 'Government Autonomous' },
  { code: '5004', name: 'Government College of Engineering, Aurangabad', district: 'Aurangabad', type: 'Government Autonomous' },
  { code: '2008', name: 'Government College of Engineering, Jalgaon', district: 'Jalgaon', type: 'Government' },
  { code: '6005', name: 'Government College of Engineering, Karad', district: 'Satara', type: 'Government Autonomous' },
  { code: '1002', name: 'Government College of Engineering, Nagpur', district: 'Nagpur', type: 'Government' },
  { code: '4005', name: 'Shri Sant Gajanan Maharaj College of Engineering', district: 'Buldhana', type: 'Un-Aided' },
  { code: '3009', name: 'Institute of Chemical Technology (ICT)', district: 'Mumbai', type: 'Government Aided' }
];

const mockBranches = ['Computer Engineering', 'Information Technology', 'Electronics and Telecommunication', 'Mechanical Engineering', 'Civil Engineering'];

// Generate consistent mock data on load
const generateMockData = () => {
  const data = [];
  mockColleges.forEach(college => {
    mockBranches.forEach(branch => {
      // Base cutoff varies by college prestige and branch
      let baseCutoff = 90;
      if (college.code === '6006' || college.code === '3012') baseCutoff = 98;
      if (college.code === '6271' || college.code === '3014') baseCutoff = 96;
      if (branch === 'Computer Engineering') baseCutoff += 1.5;
      if (branch === 'Information Technology') baseCutoff += 1.0;
      if (branch === 'Mechanical Engineering') baseCutoff -= 3.0;
      if (branch === 'Civil Engineering') baseCutoff -= 5.0;

      const categories = ['GOPENH', 'LOPENH', 'GOBCH', 'LOBCH', 'GOSC', 'LOSC'];
      
      categories.forEach(category => {
        let catMod = 0;
        if (category.includes('OBC')) catMod = -1.5;
        if (category.includes('SC')) catMod = -4.0;
        if (category.startsWith('L')) catMod = -0.5; // Ladies quota usually slightly lower or similar

        ['2022', '2023', '2024', '2025'].forEach(year => {
          let yearMod = (parseInt(year) - 2024) * 0.2; // Slight inflation over years
          
          [1, 2, 3].forEach(round => {
            let roundMod = (round - 1) * -0.5; // Cutoffs drop in later rounds
            
            let finalCutoff = baseCutoff + catMod + yearMod + roundMod + (Math.random() * 0.4 - 0.2);
            finalCutoff = Math.min(Math.max(finalCutoff, 40), 99.99); // bounds

            data.push({
              college_code: college.code,
              college_name: college.name,
              district: college.district,
              type: college.type,
              branch_name: branch,
              category: category,
              year: year,
              round: round,
              cutoff: parseFloat(finalCutoff.toFixed(2))
            });
          });
        });
      });
    });
  });
  return data;
};

const mockDatabase = generateMockData();

// Delayed response to simulate network
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // GET /predict
  async predict({ percentile, category, year = '2024', round = 3, districts = [], branches = [] }) {
    await delay(600);
    
    // Filter for specific year and round
    let results = mockDatabase.filter(d => d.year === year.toString() && d.round === round);
    
    // STRICT RULE: GOPENH users must NOT see LOPENH seats
    results = results.filter(d => d.category === category);
    
    // Optional filters
    if (districts.length > 0) {
      results = results.filter(d => districts.includes(d.district));
    }
    if (branches.length > 0) {
      results = results.filter(d => branches.includes(d.branch_name));
    }

    // Process and rank
    const ranked = results.map(d => {
      const delta = parseFloat((percentile - d.cutoff).toFixed(2));
      let status = 'Reach';
      if (delta >= 2.0) status = 'Safe';
      else if (delta >= -2.0) status = 'Moderate';

      return {
        ...d,
        delta,
        status,
        probability: delta >= 0 ? Math.min(99, 50 + (delta * 10)) : Math.max(1, 50 + (delta * 10))
      };
    });

    // Sort by cutoff descending
    return ranked.sort((a, b) => b.cutoff - a.cutoff);
  },

  // GET /trends
  async getTrends({ institute_code, branch_name, category }) {
    await delay(300);
    const trends = mockDatabase.filter(d => 
      d.college_code === institute_code && 
      d.branch_name === branch_name && 
      d.category === category
    );
    
    // Format for Recharts (Group by year)
    const formatted = ['2022', '2023', '2024', '2025'].map(year => {
      const yearData = trends.filter(t => t.year === year);
      return {
        year,
        round1: yearData.find(t => t.round === 1)?.cutoff || null,
        round2: yearData.find(t => t.round === 2)?.cutoff || null,
        round3: yearData.find(t => t.round === 3)?.cutoff || null,
      };
    });

    return formatted;
  },

  // GET /colleges
  async getColleges() {
    await delay(200);
    return mockColleges;
  },

  // POST /simulate
  async simulateRound({ profile, optionForm, currentRound }) {
    await delay(1200); // Feel like it's calculating
    
    // Simulator logic: Find the highest preference where user percentile >= cutoff
    let allottedSeat = null;
    let rank = null;

    for (let i = 0; i < optionForm.length; i++) {
      const choice = optionForm[i];
      // Mock cutoff fetch for this specific choice, round, category
      const cutoffData = mockDatabase.find(d => 
        d.college_code === choice.college_code && 
        d.branch_name === choice.branch_name && 
        d.category === profile.category &&
        d.year === '2024' &&
        d.round === currentRound
      );

      const requiredCutoff = cutoffData ? cutoffData.cutoff : 90; // Fallback

      if (profile.percentile >= requiredCutoff) {
        allottedSeat = {
          ...choice,
          allotted_category: profile.category,
          round: currentRound,
          preference_number: i + 1,
        };
        // Generate mock merit rank
        rank = Math.floor(100000 - (profile.percentile * 1000));
        break; // Stop at highest preference
      }
    }

    return {
      allotted: allottedSeat !== null,
      seat: allottedSeat,
      merit_rank: rank,
      message: allottedSeat 
        ? (allottedSeat.preference_number === 1 ? 'Admission is automatically confirmed (Auto-Freeze).' : 'Seat Allotted!')
        : `Seat not allotted in Round ${currentRound}. You remain eligible for the next round.`
    };
  }
};
