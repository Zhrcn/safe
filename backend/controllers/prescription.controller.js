exports.getPrescriptions = (req, res) => {
  res.json({
    data: [
      { id: 1, name: "Amoxicillin", dosage: "500mg", frequency: "Twice a day" },
      { id: 2, name: "Ibuprofen", dosage: "200mg", frequency: "As needed" }
    ]
  });
};
