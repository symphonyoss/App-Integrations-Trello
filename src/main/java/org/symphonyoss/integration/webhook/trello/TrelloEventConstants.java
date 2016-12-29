/**
 * Copyright 2016-2017 Symphony Integrations - Symphony LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.symphonyoss.integration.webhook.trello;

/**
 * All mapped Trello events.
 *
 * Created by rsanchez on 08/09/16.
 */
public final class TrelloEventConstants {

  private TrelloEventConstants() {}

  // Board events
  public static final String BOARD_UPDATED = "updateBoard";
  public static final String MEMBER_ADDED_TO_BOARD = "addMemberToBoard";
  public static final String BOARD_ADDED_TO_TEAM = "addToOrganizationBoard";

  // Card events
  public static final String CARD_CREATED = "createCard";
  public static final String CARD_UPDATED = "updateCard";
  public static final String CARD_COMMENT_ADDED = "commentCard";
  public static final String CARD_ADD_ATTACHMENT = "addAttachmentToCard";
  public static final String CARD_ADD_LABEL = "addLabelToCard";
  public static final String CARD_REMOVE_LABEL = "removeLabelFromCard";
  public static final String CARD_ADD_MEMBER = "addMemberToCard";
  public static final String CARD_CONVERTED_FROM_CHECK_ITEM = "convertToCardFromCheckItem";

  // Checklist events
  public static final String CHECKLIST_CREATED = "addChecklistToCard";
  public static final String CHECKLIST_ITEM_CREATED = "createCheckItem";
  public static final String CHECKLIST_ITEM_UPDATED = "updateCheckItem";
  public static final String CHECKLIST_ITEM_STATE_UPDATED = "updateCheckItemStateOnCard";

  // List events
  public static final String LIST_CREATED = "createList";
  public static final String LIST_UPDATED = "updateList";
  public static final String LIST_MOVED = "moveListFromBoard";

}
