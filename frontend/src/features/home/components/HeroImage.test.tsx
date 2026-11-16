import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import HeroImage from './HeroImage'

describe('HeroImage', () => {
  it('shows the photo of the cake with a description', () => {
    // Given the home page
    // When the photo is shown
    render(<HeroImage />)

    // Then it has a text for screen readers
    expect(screen.getByRole('img', { name: /Pastís de xocolata/ })).toBeInTheDocument()
  })

  it('lets the visitor stop and restart the movement', async () => {
    // Given the moving photo
    const user = userEvent.setup()
    render(<HeroImage />)
    const photo = screen.getByRole('img', { name: /Pastís de xocolata/ })

    // When the visitor stops it
    await user.click(screen.getByRole('button', { name: "Atura l'animació" }))

    // Then the movement stops and the button offers to restart it
    expect(photo).toHaveClass('[animation-play-state:paused]')
    await user.click(screen.getByRole('button', { name: "Reprodueix l'animació" }))
    expect(photo).not.toHaveClass('[animation-play-state:paused]')
  })
})
