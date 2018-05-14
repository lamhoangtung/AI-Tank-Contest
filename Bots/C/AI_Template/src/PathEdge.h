#pragma once
#include <glm/vec2.hpp>

class PathEdge
{
public:
	enum
	{
		normal_edge
	};

	PathEdge(glm::vec2 source,
	         glm::vec2 destination,
	         int type): m_vSource(source),
	                    m_vDestination(destination),
	                    m_iType(type)
	{
	};

	PathEdge(glm::vec2 source,
	         glm::vec2 destination) : m_vSource(source),
	                                  m_vDestination(destination),
	                                  m_iType(normal_edge)
	{
	};

	glm::vec2 Destination() const
	{
		return m_vDestination;
	}

	void SetDestination(glm::vec2 d)
	{
		m_vDestination = d;
	}

	glm::vec2 Source() const
	{
		return m_vSource;
	}

	void SetSource(glm::vec2 s)
	{
		m_vSource = s;
	}

	int Type() const
	{
		return m_iType;
	}

private:
	glm::vec2 m_vSource;
	glm::vec2 m_vDestination;
	int m_iType;
};
