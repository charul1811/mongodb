require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(r => console.log("Connected to DB")).catch(e => console.log(e));


const PersonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    favoriteFoods: [String]
});
mongoose.connection.on('connected', () => {
  console.log('✅ Successfully connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

let Person = mongoose.model('Person', PersonSchema);

const createAndSavePerson = (done) => {

  const person = new Person({
    name: "John Doe",
    age: 25,
    favoriteFoods: ["pizza", "pasta"]
  });

  person.save((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
  done(null /*, data*/);
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });

};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, person) => {
    if (err) return done(err);
    person.favoriteFoods.push(foodToAdd);

    person.save((err, updatedPerson) => {
      if (err) return done(err);
      done(null, updatedPerson);
    });
  });
};



const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
      { name: personName },
      { age: ageToSet },
      { new: true }, // return the updated doc
      (err, updatedPerson) => {
        if (err) return done(err);
        done(null, updatedPerson);
      }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({ name: nameToRemove }, (err, result) => {
    if (err) return done(err);
    done(null, result);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({favoriteFoods: foodToSearch})
      .sort({name: 1})   // sort ascending by name
      .limit(2)            // limit results to 2
      .select("-age")      // exclude age field
      .exec((err, data) => {
        if (err) return done(err);
        done(null, data);
      }).then(r => console.log(r)).catch(e => console.log(e));
} ;

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */
createAndSavePerson((err, data) => {
  if (err) return console.error("❌ Error:", err);
  console.log("✅ Person saved:", data);
});
// Temporary test
const peopleArray = [
  { name: "Alice", age: 30, favoriteFoods: ["sushi", "ramen"] },
  { name: "Bob", age: 25, favoriteFoods: ["burrito", "tacos"] },
  { name: "Charlie", age: 35, favoriteFoods: ["steak", "salad"] }
];

createManyPeople(peopleArray, (err, data) => {
  if (err) return console.error("❌ Error:", err);
  console.log("✅ People saved:", data);
});

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
