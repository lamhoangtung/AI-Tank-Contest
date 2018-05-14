#pragma once
#include "GoalEvaluator.h"
#include "MyTank.h"

class MyTank;

class EvaluatorAttackMainBase : public GoalEvaluator
{
public:
	EvaluatorAttackMainBase(float bias):GoalEvaluator(bias)
	{}
	~EvaluatorAttackMainBase();

	float CalculateDesirability(MyTank* pTank) override;
	void SetGoal(MyTank* pTank) override;
};

