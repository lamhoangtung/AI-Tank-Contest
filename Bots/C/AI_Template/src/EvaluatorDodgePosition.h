#pragma once
#include "GoalEvaluator.h"
#include "MyTank.h"

class MyTank;

class EvaluatorDodgePosition: public GoalEvaluator
{
public:
	EvaluatorDodgePosition(float bias) :GoalEvaluator(bias)
	{}
	~EvaluatorDodgePosition();

	float CalculateDesirability(MyTank* pTank) override;
	void SetGoal(MyTank* pTank) override;
};