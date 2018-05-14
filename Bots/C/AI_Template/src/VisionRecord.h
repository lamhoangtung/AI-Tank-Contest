#pragma once
#include <glm/vec2.hpp>

class VisionRecord
{
public:
	VisionRecord():m_bWithinView(0),
				   m_bShootable(0),
				   hp(0)
	{};
	~VisionRecord();

	glm::vec2 m_vLastSeenPosition;
	bool m_bWithinView;
	bool m_bShootable;
	float hp;
};

