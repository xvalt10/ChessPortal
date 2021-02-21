package application.tournaments;

import java.util.List;
import java.util.stream.Collectors;

import org.javatuples.Pair;

import application.domain.Player;
import application.util.FloatStatus;

public class SwissSystemPairingCriteria {

	private ScoreGroup scoreGroup;

	boolean doubleUpfloat_b5;
	boolean doubleDownfloat_b5;
	boolean sameDonwfloatAsTwoRoundsBefore_b6;
	boolean sameUpfloatAsTwoRoundsBefore_b6;

	public SwissSystemPairingCriteria(ScoreGroup scoreGroup) {
		this.scoreGroup = scoreGroup;
	}

	private boolean playersHaveNotPlayedEachOther_b1a(Player player, Player oponent) {
		return !player.getPreviousOponents().contains(oponent);
	}

	private boolean playersDontHaveSameAbsoluteColorPreference_b2(Player player, Player oponent) {
		return Math.abs(player.getColorBalance()) < 2 || Math.abs(oponent.getColorBalance()) < 2
				|| player.getColorBalance() != oponent.getColorBalance();
	}

	private boolean pairingsSatfisfyMinumumNumberOfColorPreferences_b4(List<Pair<Player, Player>> pairs) {
		int pairingsViolatingColourPreference = pairs.stream()
				.filter(pair -> pair.getValue0().getExpectedColor() == pair.getValue1().getExpectedColor())
				.collect(Collectors.toList()).size();
		return pairingsViolatingColourPreference <= scoreGroup.x;
	}

	public boolean noIdenticalFloatInTwoConsecutiveRounds_b5(Player player, Player oponent) {

		boolean noForbiddenDownfloat = oponent == null && doubleDownfloat_b5
				? player.getFloatStatus() != FloatStatus.DOWN
				: true;
		boolean noForbiddenUpfloat = oponent != null && doubleUpfloat_b5
				? (player.getPoints() == oponent.getPoints()
						|| (player.getPoints() > oponent.getPoints() && player.getFloatStatus() != FloatStatus.UP)
						|| (player.getPoints() < oponent.getPoints() && oponent.getFloatStatus() != FloatStatus.UP))
				: true;

		return noForbiddenDownfloat && noForbiddenUpfloat;
	}

	public boolean noIdenticalFloatInAsTwoRoundsBefore_b6(Player player, Player oponent) {

		boolean noForbiddenDownfloat = oponent == null && sameDonwfloatAsTwoRoundsBefore_b6
				? player.getFloatStatus() != FloatStatus.DOWNPREV
				: true;
		boolean noForbiddenUpfloat = oponent != null && sameUpfloatAsTwoRoundsBefore_b6
				? (player.getPoints() == oponent.getPoints()
						|| (player.getPoints() > oponent.getPoints() && player.getFloatStatus() != FloatStatus.UPPREV)
						|| (player.getPoints() < oponent.getPoints() && oponent.getFloatStatus() != FloatStatus.UPPREV))
				: true;

		return noForbiddenDownfloat && noForbiddenUpfloat;
	}

	public boolean pairingsSatisfyCriteria(List<Pair<Player, Player>> pairs, Player downfloater, Player bye) {

		boolean pairsMatchCriteria = pairs.stream()
				.allMatch(pair -> playersHaveNotPlayedEachOther_b1a(pair.getValue0(), pair.getValue1())
						&& playersDontHaveSameAbsoluteColorPreference_b2(pair.getValue0(), pair.getValue1()));
						//&& noIdenticalFloatInTwoConsecutiveRounds_b5(pair.getValue0(), pair.getValue1())
						//&& noIdenticalFloatInAsTwoRoundsBefore_b6(pair.getValue0(), pair.getValue1()))
				//&& pairingsSatfisfyMinumumNumberOfColorPreferences_b4(pairs)
						

		boolean downfloaterMatchesCriteria = downfloater != null
				? noIdenticalFloatInTwoConsecutiveRounds_b5(downfloater, null)
						&& noIdenticalFloatInAsTwoRoundsBefore_b6(downfloater, null)
				: true;

		boolean playerWithByeMatchesCriteria = true;

		return pairsMatchCriteria && downfloaterMatchesCriteria && playerWithByeMatchesCriteria;
	}

}
