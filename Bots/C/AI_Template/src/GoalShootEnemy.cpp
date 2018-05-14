#include "GoalShootEnemy.h"
#include "GoalType.h"
#include "MyTeam.h"

GoalShootEnemy::GoalShootEnemy(MyTank* pOwner, glm::vec2 aimPosition) 
	: Goal(pOwner, goal_shoot_enemy),
	m_vAimPosition(aimPosition)
{
}

GoalShootEnemy::~GoalShootEnemy()
{
}

void GoalShootEnemy::Activate()
{
	m_iStatus = active;
}

int GoalShootEnemy::Process()
{
	ActivateIfInactive();
	if (m_pOwner->isShootableAEnemy(m_vAimPosition))
	{
		m_pOwner->AimAndShootAtPosition(m_vAimPosition);
		m_iStatus = completed;
	}
	else
	{
		m_iStatus = failed;
	}
	ReactivateIfFailed();
	return m_iStatus;
}

void GoalShootEnemy::Terminate()
{
	m_pOwner->FireOff();
}
