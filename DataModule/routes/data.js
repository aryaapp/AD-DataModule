var express = require('express');
var router = express.Router();
var azure = require('azure-storage');
var nconf = require('nconf');
var nconf = nconf.file("./settings/settings.json").load();
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
router.post('/saveUser', function (req, res, next) {
    var user = req.body;
    var tableService = azure.createTableService(nconf.azureStorage.accountName, nconf.azureStorage.accountKey);
    var entGen = azure.TableUtilities.entityGenerator;
    var entity = {
        PartitionKey: entGen.String(user.origin),
        RowKey: entGen.String(user.user_id),
    };
    tableService.insertEntity('User', entity, function (error, result, response) {
        if (!error) {
        }
    });
    res.json({ result: "ok" });
});
router.post('/saveJournal', function (req, res, next) {
    var journal = req.body;
    var tableService = azure.createTableService(nconf.azureStorage.accountName, nconf.azureStorage.accountKey);
    var entGen = azure.TableUtilities.entityGenerator;
    var answers = journal.answers;
    answers.forEach(function (answer) {
        var value = '';
        if (answer.value) {
            value = JSON.stringify(answer.value);
        }
        var entity = {
            PartitionKey: entGen.String(answer.questionId),
            RowKey: entGen.String(journal.journalSessionId),
            JournalId: entGen.String(journal.journalId),
            Value: entGen.String(value),
            UserId: entGen.String(journal.userId),
            Origin: entGen.String(journal.origin),
        };
        tableService.insertEntity('AnswerEntry', entity, function (error, result, response) {
            if (!error) {
            }
            else {
                console.log(error + " - " + JSON.stringify(answer));
            }
        });
    });
    res.json({ result: "ok" });
});
router.post('/saveActivity', function (req, res, next) {
    var activity = req.body;
    var tableService = azure.createTableService(nconf.azureStorage.accountName, nconf.azureStorage.accountKey);
    var entGen = azure.TableUtilities.entityGenerator;
    var entity = {
        PartitionKey: entGen.String(activity.activityId),
        RowKey: entGen.String(activity.activitySessionId),
        UserId: entGen.String(activity.userId),
        Origin: entGen.String(activity.origin),
    };
    tableService.insertEntity('ActivityEntry', entity, function (error, result, response) {
        if (!error) {
            res.json({ result: "ok" });
        }
    });
});
router.post('/saveScreening', function (req, res, next) {
    res.json({ result: "ok" });
});
module.exports = router;
//# sourceMappingURL=data.js.map