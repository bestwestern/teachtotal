export const Cache = ({ currentQuestionAnswers, pictureIds }) => {
  if (!currentQuestionAnswers) return null;
  return (
    <div
      class="bg-red-50"
      style={{
        position: "fixed",
        bottom: "-1100px",
        width: "200px",
        height: "200px",
      }}
    >
      {Object.values(currentQuestionAnswers).map(({ answers }) => {
        return (
          <div>
            {[...pictureIds, ...answers.map(({ pictureId }) => pictureId)].map(
              (pictureId) => {
                return (
                  pictureId && <img src={"/imgs/" + pictureId + ".webp"}></img>
                );
              }
            )}
          </div>
        );
      })}
    </div>
  );
};
