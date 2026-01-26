import { css } from '@nutsloop/neonjsx';

export default function NodeTransmission() {
  /* component styles */
  css( './css/components/animation/node-transmission.css' );

  return (
    <>
      <p class="animation-box__title">Interlinked Node Transmission</p>
      <div class="node-transmission">
        <img
          class="node-transmission__img node-transmission__img--dark"
          src="./media/components/animation-box/node-transmission-dark.svg"
          alt=""
          width="520"
          height="320"
          aria-hidden="true"
        />
        <img
          class="node-transmission__img node-transmission__img--light"
          src="./media/components/animation-box/node-transmission-light.svg"
          alt=""
          width="520"
          height="320"
          aria-hidden="true"
        />
      </div>
      <p class="animation-box__body">
        Signals pulse through the grid, echoing in synchronized neon loops.
      </p>
    </>
  );
}
