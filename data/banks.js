export const providers = [
  { id: 'blue', name: 'Blue Cloud', color: '#4979ff' },
  { id: 'orange', name: 'Orange Cloud', color: '#f29c45' },
  { id: 'green', name: 'Green Cloud', color: '#4fbf8f' }
];

// Synthetic institutions for the hackathon MVP.
// No row represents a real bank or a claim about a real institution.
export const banks = [
  { id:'B01', label:'Universal 01', type:'Large universal', provider:'blue', criticalLoad:120, readiness:.88, importance:3 },
  { id:'B02', label:'Retail 01', type:'Large retail', provider:'blue', criticalLoad:105, readiness:.82, importance:3 },
  { id:'B03', label:'Corporate 01', type:'Corporate', provider:'blue', criticalLoad:82, readiness:.76, importance:2 },
  { id:'B04', label:'Digital 01', type:'Digital', provider:'blue', criticalLoad:68, readiness:.93, importance:2 },
  { id:'B05', label:'Regional 01', type:'Regional', provider:'blue', criticalLoad:52, readiness:.61, importance:1 },
  { id:'B06', label:'Retail 02', type:'Retail', provider:'blue', criticalLoad:76, readiness:.71, importance:2 },
  { id:'B07', label:'Digital 02', type:'Digital', provider:'blue', criticalLoad:61, readiness:.90, importance:2 },
  { id:'B08', label:'Regional 02', type:'Regional', provider:'blue', criticalLoad:44, readiness:.58, importance:1 },

  { id:'B09', label:'Universal 02', type:'Large universal', provider:'orange', criticalLoad:116, readiness:.85, importance:3 },
  { id:'B10', label:'Retail 03', type:'Large retail', provider:'orange', criticalLoad:98, readiness:.79, importance:3 },
  { id:'B11', label:'Corporate 02', type:'Corporate', provider:'orange', criticalLoad:78, readiness:.74, importance:2 },
  { id:'B12', label:'Digital 03', type:'Digital', provider:'orange', criticalLoad:64, readiness:.91, importance:2 },
  { id:'B13', label:'Regional 03', type:'Regional', provider:'orange', criticalLoad:49, readiness:.64, importance:1 },
  { id:'B14', label:'Retail 04', type:'Retail', provider:'orange', criticalLoad:71, readiness:.72, importance:2 },
  { id:'B15', label:'Corporate 03', type:'Corporate', provider:'orange', criticalLoad:73, readiness:.69, importance:2 },

  { id:'B16', label:'Universal 03', type:'Large universal', provider:'green', criticalLoad:112, readiness:.87, importance:3 },
  { id:'B17', label:'Retail 05', type:'Retail', provider:'green', criticalLoad:88, readiness:.81, importance:2 },
  { id:'B18', label:'Digital 04', type:'Digital', provider:'green', criticalLoad:59, readiness:.94, importance:2 },
  { id:'B19', label:'Regional 04', type:'Regional', provider:'green', criticalLoad:47, readiness:.62, importance:1 },
  { id:'B20', label:'Corporate 04', type:'Corporate', provider:'green', criticalLoad:75, readiness:.77, importance:2 }
];