#include "GoalAtackMainBase.h"
#include "GoalMoveToPosition.h"

GoalAtackMainBase::~GoalAtackMainBase()
{
}


void GoalAtackMainBase::Activate()
{
	m_iStatus = active;
	RemoveAllSubgoals();
	m_vAimTarget = TargetMgr->GetBestTargetMainBasePosition(m_pOwner);
	m_vGoodPosition = TargetMgr->GetBestPositionToAttackMainBase(m_pOwner, m_vAimTarget);
	AddSubgoal(new GoalMoveToPosition(m_pOwner, m_vGoodPosition));
}

int GoalAtackMainBase::Process()
{
	ActivateIfInactive();
	m_iStatus = ProcessSubgoals();
	if(m_pOwner->isShootableBase(m_vAimTarget) && m_pOwner->isAtPosition(m_vGoodPosition))
	{
		m_pOwner->FireOn();
		m_pOwner->MoveOn();
		m_pOwner->AimAndShootAtPosition(m_vAimTarget);
	}else
	{
		m_pOwner->FireOn();
		m_pOwner->MoveOn();
	}
	ReactivateIfFailed();
	return m_iStatus;
}

void GoalAtackMainBase::Terminate()
{
//	m_pOwner->FireOff();
}
