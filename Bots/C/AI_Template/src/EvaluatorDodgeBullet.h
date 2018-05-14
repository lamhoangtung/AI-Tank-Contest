#pragma once
#include "GoalEvaluator.h"
#include "MyTank.h"
#include "ai/AI.h"

class MyTank;

class EvaluatorDodgeBullet : public GoalEvaluator
{
public:
	EvaluatorDodgeBullet(float bias):GoalEvaluator(bias)
	{}
	~EvaluatorDodgeBullet();

	float CalculateDesirability(MyTank* pTank) override;
	void SetGoal(MyTank* pTank) override;
};

