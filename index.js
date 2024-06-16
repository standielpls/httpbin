const express = require('express');
const { faker } = require('@faker-js/faker');

const app = express();
const PORT = process.env.PORT || 3000;

const generateRandomJson = (sizeInMB, start = 0, limit = 10) => {
  const data = [];
  const targetSize = sizeInMB * 1024 * 1024;
  let currentSize = 0;
  let recordIndex = 0;

  while (currentSize < targetSize) {
    const record = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      bio: faker.lorem.paragraph(),
      jobTitle: faker.person.jobTitle(),
      company: faker.company.name(),
      website: faker.internet.url(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString()
    };

    const recordStr = JSON.stringify(record);
    currentSize += Buffer.byteLength(recordStr, 'utf8');
    if (recordIndex >= start && data.length < limit) {
      data.push(record);
    }
    recordIndex++;
  }

  return data;
};

app.get('/', (req, res) => {
  res.send('hello');
})

app.get('/random-data', (req, res) => {
  const size = parseInt(req.query.size, 10) || 1; // Default to 1MB if not provided
  const start = parseInt(req.query._start, 10) || 0; // Default to 0 if not provided
  const limit = parseInt(req.query._limit, 10) || 10; // Default to 10 if not provided

  const secret = req.query.secret;
  if (secret === 'stansecret') {
    const data = generateRandomJson(size, start, limit);
    res.json(data);
    return
  }
  if (size > 6) {
    return res.json({"error": "max size is 6mb"});
  }

  const data = generateRandomJson(size);
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = {
  generateRandomJson
}