/**
 * [{type:1,score:8,questionscore:10},
{type:5,score:0,questionscore:10},
{type:2,score:15,questionscore:20},
{type:8,score:6,questionscore:20}]
type:1 ,5 选择，判断类型， 只有对错
type:2,8  填空，简答类型，根据得分展示需努力，合格，良好，优秀
需努力0-0.6
合格0.6-0.8
良好0.8-0.9
优秀0.9-1
不能使用if else switch
 * 数据和逻辑解耦分离
 */
const data = [
  { type: 1, score: 10, questionscore: 10 },
  { type: 5, score: 0, questionscore: 10 },
  { type: 2, score: 15, questionscore: 20 },
  { type: 8, score: 8, questionscore: 20 },
  { type: 10, score: 20, questionscore: 20 }
];
const singleType = [1, 5];
const status = {
  0: "错",
  1: "对",
  60: "需努力",
  80: "合格",
  90: "良好",
  100: "优秀"
};
function getResult(data) {
  let result = [];
  data.map(item => {
    const finallyscore = (100 * item.score) / item.questionscore;
    item.finallyscore = !singleType.includes(item.type)
      ? finallyscore
      : finallyscore == 100
      ? 1
      : 0;
  });
  data.forEach((item, index) => {
    for (let key in status) {
      if (item.finallyscore <= key) {
        result.push(status[key]);
        break;
      }
    }
  });
  console.log(result);
  return result;
}
getResult(data);

/**
 *
 */
const config = () => {
  return {
    "^(1|5)_100$": "resultCard-item-checkRight",
    "^(1|5)_0$": "resultCard-item-checkWrong",
    "^(3|8|19)_(0|([1-5]d))$": "resultCard-item-waitStrive",
    "^(3|8|19)_[6-7]d$": "resultCard-item-qualified",
    "^(3|8|19)_8d$": "resultCard-item-well",
    "^(3|8|19)_((100)|(9d))$": "resultCard-item-excellent"
  };
};
function dealStageAndJudge(type, score) {
  let resultStatus = "",
    mapConfig = [];
  const configList = config();
  for (let key in configList) {
    mapConfig.push([
      key,
      () => {
        resultStatus = configList[key];
      }
    ]);
  }
  const itemImg = new Map(mapConfig);
  const judgetest = (type, score) => {
    let action = [...itemImg].filter(([key, value]) =>
      new RegExp(key).test(`${type}_${score}`)
    );
    action.forEach(([key, value]) => value());
  };
  judgetest(type, score);
  return resultStatus;
}
console.log(dealStageAndJudge(1, 100));
