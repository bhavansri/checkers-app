import { useEffect, useState } from "react";

type VictoryModalProps = {
  computerScore: number;
  playerScore: number;
  onReset: () => void;
};

enum PlayerNames {
  Cpu = "Computer",
  Player = "Player",
  None = "None",
}

const VictoryModal = ({
  computerScore,
  playerScore,
  onReset,
}: VictoryModalProps) => {
  const [display, setDisplay] = useState(false);
  const [winnerName, setWinnerName] = useState(PlayerNames.None);

  const onPlayAgain = () => {
    setDisplay(false);
    onReset();
  };

  useEffect(() => {
    if (computerScore === 12) {
      setWinnerName(PlayerNames.Cpu);
    } else if (playerScore === 12) {
      setWinnerName(PlayerNames.Player);
    }

    setDisplay(true);
  }, [computerScore, playerScore]);

  if (
    display &&
    (winnerName === PlayerNames.Cpu || winnerName === PlayerNames.Player)
  ) {
    return (
      <div
        data-testid="victory-modal"
        className="fixed top-0 left-0 right-0 z-50 w-[400px] p-4"
      >
        <div className="relative w-full">
          <div className="relative bg-neutral-800 rounded-lg shadow">
            <div className="flex items-start justify-center p-4 rounded-t">
              <h4
                data-testid="victory-header"
                className="text-xl font-semibold text-white capitalize"
              >
                {`${winnerName} wins!`}
              </h4>
            </div>
            <div className="p-6 font-semibold">
              <p className="text-base text-gray-300 mb-5 uppercase">
                Final Scores:
              </p>
              <div className="flex gap-5">
                <p className="text-base text-red-700 mb-3">{`Computer - ${computerScore}`}</p>
                <p className="text-base text-neutral-100">{`Player - ${playerScore}`}</p>
              </div>
            </div>
            <div className="flex items-center justify-center p-6 gap-2 rounded-b">
              <button
                data-modal-hide="defaultModal"
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={onPlayAgain}
              >
                Play again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default VictoryModal;
