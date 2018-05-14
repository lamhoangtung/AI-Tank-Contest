#pragma once
class MyTank;

class GoalEvaluator
{
public:
	GoalEvaluator(float cb):m_fCharacterBias(cb)
	{}
	virtual ~GoalEvaluator();

	virtual float CalculateDesirability(MyTank* pTank) = 0;
	virtual void SetGoal(MyTank* pTank) = 0;
protected:
	float m_fCharacterBias;
};

