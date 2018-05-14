#include "EvaluatorDodgeStrike.h"
#include "MyTeam.h"

EvaluatorDodgeStrike::~EvaluatorDodgeStrike()
{
}

float EvaluatorDodgeStrike::CalculateDesirability(MyTank* pTank)
{
	std::vector<glm::vec2> dangrousStrikePos =
		MyTeamMgr->GetDangerouseStrikePosToTank(pTank->GetPosition());
	if (!dangrousStrikePos.empty())
	{
		return 1001;
	}
	return 1;
}

void EvaluatorDodgeStrike::SetGoal(MyTank* pTank)
{
	pTank->GetBrain()->AddGoalDodgeStrike();
}
