function isQuestionWithOptions(question) {

    return (question.type === 'CB' || question.type === 'RB');
}

module.exports = {
    verify: verify,
};