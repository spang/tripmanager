// This is NOT a node script; it's just a mongo shell script!
//
// invoke with:
//     mongo --quiet scripts/populate_initial_data.js

db = connect("localhost/tripmanager")

var initial_questions = [ {
        "question"    : "Please specify any dietary restrictions.",
        "answer_type" : "Choice",
        "is_stock"    : true,
        "choices"     : [
            "vegetarian", "vegan",
            "gluten free", "kosher",
            "other (please describe)"
        ],
    }, {
        "question"      : "phone number",
        "answer_type"   : "String",
        "is_stock"      : true,
        // XXX what happens if we're messy with this?
        // null vs empty array
        // "choices"       : [],
    }, {
    // this "blank question" makes it much easier for us to
    // write the question display logic, because we can just
    // loop through and have a default "new question" with
    // type dropdown if no type is given
        "question"       : "",
        "answer_type"    : "",
        "is_stock"       : true,
    },
];

for (var i in initial_questions) {
    db.questions.save(initial_questions[i]);
}
