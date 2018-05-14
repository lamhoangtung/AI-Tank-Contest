#pragma once
#include "GoalEvaluator.h"
#include "MyTank.h"

class MyTank;

class EvaluatorDodgeStrike : public GoalEvaluator
{
public:
	EvaluatorDodgeStrike(float bias) :GoalEvaluator(bias)
	{}
	~EvaluatorDodgeStrike();

	float CalculateDesirability(MyTank* pTank) override;
	void SetGoal(MyTank* pTank) override;
};