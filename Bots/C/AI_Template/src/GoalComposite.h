#pragma once
#include "Goal.h"
#include <list>
#include <iostream>

template <class entity_type>
class GoalComposite : public Goal<entity_type>
{
private:
	typedef std::list<Goal<entity_type>*> SubgoalList;
protected:
	SubgoalList m_SubGoals;
	int ProcessSubgoals();
	bool ForwardMessageToFrontSubgoal(const Telegram& msg);
public:
	GoalComposite(entity_type* pE, int type):Goal<entity_type>(pE, type){}
	virtual ~GoalComposite() { RemoveAllSubgoals(); }

	virtual void Activate() = 0;
	virtual int Process() = 0;
	virtual void Terminate() = 0;

	bool HandleMessage(const Telegram& msg) override
	{ return ForwardMessageToFrontSubgoal(msg); }
	void AddSubgoal(Goal<entity_type>* g) override;
	void RemoveAllSubgoals();
};

template <class entity_type>
int GoalComposite<entity_type>::ProcessSubgoals()
{
	while(!m_SubGoals.empty() && (m_SubGoals.front()->isComplete() || m_SubGoals.front()->hasFailed()))
	{
		m_SubGoals.front()->Terminate();
		delete m_SubGoals.front();
		m_SubGoals.pop_front();
	}
	if(!m_SubGoals.empty())
	{
		int StatusOfSubGoals = m_SubGoals.front()->Process();
		if (StatusOfSubGoals == completed && m_SubGoals.size() > 1)
		{
			return active;
		}
		return StatusOfSubGoals;
	}else
	{
		return completed;
	}
}

template <class entity_type>
bool GoalComposite<entity_type>::ForwardMessageToFrontSubgoal(const Telegram& msg)
{
	if (!m_SubGoals.empty())
	{
		return m_SubGoals.front()->HandleMessage(msg);
	}
	return false;
}

template <class entity_type>
void GoalComposite<entity_type>::AddSubgoal(Goal<entity_type>* g)
{
	m_SubGoals.push_front(g);
}

template <class entity_type>
void GoalComposite<entity_type>::RemoveAllSubgoals()
{
	for (SubgoalList::iterator it = m_SubGoals.begin(); it != m_SubGoals.end(); it++)
	{
		(*it)->Terminate();
		delete *it;
	}
	m_SubGoals.clear();
}
